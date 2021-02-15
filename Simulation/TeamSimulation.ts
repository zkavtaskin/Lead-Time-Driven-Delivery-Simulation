import { Backlog } from "./Backlog";
import { Clock } from "./Clock";
import { Team } from "./Team";
import { BacklogConfig } from "./BacklogConfig";
import { TeamConfig } from "./TeamConfig";
import { Story } from "./Story";
import * as simplestats from 'simple-statistics'
import { TeamMetrics } from "./TeamMetrics";


export class TeamSimulation {
    private clock :Clock;
    private backlog :Backlog;
    private teamConfig : TeamConfig;
    private backlogConfig : BacklogConfig;
    private team : Team;

    public get TeamConfig() : TeamConfig {
      return this.teamConfig;
    }

    public get BacklogConfig() : BacklogConfig {
      return this.backlogConfig;
    }

    constructor(teamConfig :TeamConfig, backlogConfig :BacklogConfig, effortSizePerTick :number, backlogSortFunc : (a : Story, b : Story) => number = null, deterministic :boolean = false) {

      //create own copy to avoid config mutation
      this.teamConfig = JSON.parse(JSON.stringify(teamConfig));
      this.backlogConfig = backlogConfig.Copy();

      this.clock = new Clock(effortSizePerTick);
      this.backlog = Backlog.Generate(this.teamConfig.Members, this.backlogConfig, backlogSortFunc);
      this.team = new Team(this.teamConfig, this.backlog, this.clock);

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
     const S  = simplestats.median(Array.from({length:100}, () => this.backlogConfig.GenerateStorySize()));
     const U  = this.clock.EffortSize;
      for(let columnId:number = 0; columnId < this.teamConfig.Graph.length; columnId++) {
        const teamMember = this.teamConfig.Members[columnId];
        const Cr = teamMember.BacklogContribution;
        const Cc = teamMember.Capacity;
        const W = 1 / ((S * Cr) / (Cc * U));
        for(let rowId:number = 0; rowId < columnId; rowId++) {
          if(deterministic) {
            //this removes randomness factor from team work processing, this is used during optimisation
            this.teamConfig.Graph[rowId][columnId] = 0;
          } else {
            this.teamConfig.Graph[rowId][columnId] *= W;
          }
        }
      }
    }

    public Reset(backlogSortFunc : (a : Story, b : Story) => number = null) {
      this.clock = new Clock(this.clock.EffortSize);
      this.backlog.Reset(backlogSortFunc);
      this.team = new Team(this.teamConfig, this.backlog, this.clock);
    }

    public Run() : TeamMetrics {
      return this.team.Work();
    }
  }