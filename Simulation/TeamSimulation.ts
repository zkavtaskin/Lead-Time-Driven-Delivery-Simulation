import { Backlog } from "./Backlog";
import { Clock } from "./Clock";
import { TeamMember } from "./TeamMember";
import { BacklogConfig } from "./BacklogConfig";
import { TeamConfig } from "./TeamConfig";

export class TeamSimulation {

    private name :string;
    private clock :Clock;
    private backlog :Backlog;
    private teamMembers :Array<TeamMember>;

    constructor(name :string, teamConfig :TeamConfig, backlogConfig :BacklogConfig,  effortSizePerTick :number) {
      this.name = name;

      //create own copy to avoid config mutation
      teamConfig = JSON.parse(JSON.stringify(teamConfig));
      backlogConfig = JSON.parse(JSON.stringify(backlogConfig));

      this.clock = new Clock(effortSizePerTick);
      this.backlog = Backlog.Generate(teamConfig.Members, backlogConfig);

      this.teamMembers= new Array<TeamMember>();
      teamConfig.Members.forEach((member, index) => 
          this.teamMembers.push(new TeamMember(index, member, teamConfig.Graph)));
        
      //Graph feedback tick normalisation
      let backlogStats = this.backlog.GetStats(); 
      teamConfig.Graph.forEach((row, rowTeamMemberId) => {
        for(let columnTeamMemberId:number = rowTeamMemberId; columnTeamMemberId < teamConfig.Graph.length; columnTeamMemberId++) {
          let ratioOfStoryDoneOnAvg = this.clock.EffortSize / backlogStats.TeamMembersOriginal[rowTeamMemberId].Mean;
          teamConfig.Graph[rowTeamMemberId][columnTeamMemberId] = ratioOfStoryDoneOnAvg * teamConfig.Graph[rowTeamMemberId][columnTeamMemberId];
        }
      });
    }
  
    public Run() : Backlog {
      while(!this.backlog.IsCompleted) {
        this.teamMembers.forEach(member => member.DoWork(this.backlog, this.clock));
        this.clock.Tick();
      }
  
      return this.backlog;
    }
  
  }