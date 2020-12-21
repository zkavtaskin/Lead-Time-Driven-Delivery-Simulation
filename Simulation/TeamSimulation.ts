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
      this.backlog = Backlog.Generate(this.teamConfig.Members, this.backlogConfig, backlogSortFunc);
      
      this.teamMembers = new Array<TeamMember>();
      this.teamConfig.Members.forEach((member, index) => this.teamMembers.push(new TeamMember(index, member, this.teamConfig.Graph)));
        
      /***
       * >Graph "feedback" upstream tick normalisation, this adds weight to the ratio to prevent frequent feeback:
       * Let Cc be member capacity, Cr be  member contribution, S be average size of work,
       * U units of work completed per turn and F feedback ratio. S distribution is uniform. 
       * Find W weight that is added to the F.
       * 
       * S * Cr gives amount of work that a team member can do.
       * Cc * U gives you team members capacity per turn. 
       * (S * Cr) / (Cc * U) gives you number of turns required to complete a story. 
       * 1 / ((S * Cr) / (Cc * U)) gives you W weight reciprocal 
       * 1 / ((S * Cr) / (Cc * U))  * F gives you weighted feedback ratio. 
      */ 
      for(let columnId:number = 0; columnId < this.teamConfig.Graph.length; columnId++) {
        const teamMember = this.teamConfig.Members[columnId];
        const S  = (this.backlogConfig.MaxStorySize + this.backlogConfig.MinStorySize) / 2;
        const Cr = teamMember.BacklogContribution;
        const Cc = teamMember.Capacity;
        const U  = this.clock.EffortSize;
        const W = 1 / ((S * Cr) / (Cc * U));
        for(let rowId:number = 0; rowId < columnId; rowId++) {
          this.teamConfig.Graph[rowId][columnId] *= W;
        }
      }
    }

    public Reset(backlogSortFunc : (a : Story, b : Story) => number = null) {
      this.clock = new Clock(this.clock.EffortSize);
      this.backlog.Reset(backlogSortFunc);
    }

    public Run() : Backlog {
      while(!this.backlog.IsCompleted) {
        this.teamMembers.forEach(member => member.DoWork(this.backlog, this.clock));
        this.clock.Tick();
      }
      return this.backlog;
    }
  }