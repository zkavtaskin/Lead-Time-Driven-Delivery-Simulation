import { Backlog } from "./Backlog";
import { Clock } from "./Clock";
import { TeamMember } from "./TeamMember";
import { BacklogConfig } from "./BacklogConfig";
import { TeamConfig } from "./TeamConfig";
import { Story } from "./Story";

export class TeamSimulation {

    private name :string;
    private clock :Clock;
    private backlog :Backlog;
    private teamMembers :Array<TeamMember>;
    private teamConfig : TeamConfig;
    private backlogConfig : BacklogConfig;

    public get TeamConfig() : TeamConfig {
      return this.teamConfig;
    }

    public get BacklogConfig() : BacklogConfig {
      return this.backlogConfig;
    }

    constructor(name :string, teamConfig :TeamConfig, backlogConfig :BacklogConfig, effortSizePerTick :number, backlogSortFunc : (a : Story, b : Story) => number = null, backlog:Backlog = null) {
      this.name = name;

      //create own copy to avoid config mutation
      this.teamConfig = JSON.parse(JSON.stringify(teamConfig));
      this.backlogConfig = JSON.parse(JSON.stringify(backlogConfig));

      this.clock = new Clock(effortSizePerTick);

      if(backlog == null) 
        this.backlog = Backlog.Generate(this.teamConfig.Members, this.backlogConfig, backlogSortFunc);
      else 
        this.backlog = backlog;
      
      this.teamMembers = new Array<TeamMember>();
      this.teamConfig.Members.forEach((member, index) => 
          this.teamMembers.push(new TeamMember(index, member, this.teamConfig.Graph)));
        
      //Graph feedback tick normalisation
      const backlogStats = this.backlog.GetStats(); 
      this.teamConfig.Graph.forEach((row, rowTeamMemberId) => {
        for(let columnTeamMemberId:number = rowTeamMemberId; columnTeamMemberId < this.teamConfig.Graph.length; columnTeamMemberId++) {
          let ratioOfStoryDoneOnAvg = this.clock.EffortSize / backlogStats.TeamMembersOriginal[rowTeamMemberId].Mean;
          this.teamConfig.Graph[rowTeamMemberId][columnTeamMemberId] = ratioOfStoryDoneOnAvg * this.teamConfig.Graph[rowTeamMemberId][columnTeamMemberId];
        }
      });
    }

    public Recycle(backlogSortFunc : (a : Story, b : Story) => number = null) : TeamSimulation {
      return new TeamSimulation(this.name, this.teamConfig, null, this.clock.EffortSize, null, this.backlog.Recycle(backlogSortFunc));
    }

    public Run() : Backlog {
      while(!this.backlog.IsCompleted) {
        this.teamMembers.forEach(member => member.DoWork(this.backlog, this.clock));
        this.clock.Tick();
      }
  
      return this.backlog;
    }
  }