import { Backlog } from "./Backlog";
import { Clock } from "./Clock";
import { TeamMember } from "./TeamMember";
import { BacklogConfig } from "./BacklogConfig";

export class TeamSimulation {

    private name :string;
    private teamConfig :any;
    private backlogConfig :BacklogConfig;
    private intervalSize :number;

    constructor(name :string, teamConfig :any, backlogConfig :BacklogConfig,  intervalSize :number) {
      this.name = name;
      this.intervalSize = intervalSize;
      this.teamConfig = teamConfig;
      this.backlogConfig = backlogConfig;
    }
  
    public Run() {
      let clock:Clock = new Clock(this.intervalSize);
      let backlog = Backlog.Generate(this.teamConfig.Members, this.backlogConfig);

      let teamMembers:Array<TeamMember> = new Array<TeamMember>();
      this.teamConfig.Members.forEach((member, index) => 
          teamMembers.push(new TeamMember(index, member, this.teamConfig.Graph)));

      this.calibrateGraphFeedback(this.teamConfig.Graph, backlog.Stats, clock);
  
      while(!backlog.IsCompleted) {
        teamMembers.forEach(member => member.DoWork(backlog, clock));
        clock.Tick();
      }
  
      return backlog;
    }

  
    private calibrateGraphFeedback(graph :any, stats :any, clock :Clock) :void {
      graph.forEach((row, rowIndex) => {
        for(let columnIndex:number = rowIndex; columnIndex < graph.lenght; columnIndex++) {
          graph[rowIndex][columnIndex] = (clock.IntervalSize / stats[rowIndex].Value) * graph[rowIndex][columnIndex];
        }
      });
    }
  
  }