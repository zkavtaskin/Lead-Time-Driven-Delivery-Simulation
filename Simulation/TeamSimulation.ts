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

    constructor(name :string, teamConfig :TeamConfig, backlogConfig :BacklogConfig,  intervalSize :number) {
      this.name = name;

      let clock:Clock = new Clock(intervalSize);
      this.backlog = Backlog.Generate(teamConfig.Members, backlogConfig);

      this.teamMembers= new Array<TeamMember>();
      teamConfig.Members.forEach((member, index) => 
          this.teamMembers.push(new TeamMember(index, member, teamConfig.Graph)));
        
      //Graph calibration
      teamConfig.Graph.forEach((row, rowTeamMemberId) => {
        for(let columnTeamMemberId:number = rowTeamMemberId; columnTeamMemberId < teamConfig.Graph.length; columnTeamMemberId++) {
          teamConfig.Graph[rowTeamMemberId][columnTeamMemberId] = (clock.IntervalSize / this.backlog.Stats[rowTeamMemberId].AverageValue) * teamConfig.Graph[rowTeamMemberId][columnTeamMemberId];
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