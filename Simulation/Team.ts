import { Backlog } from "./Backlog";
import { Clock } from "./Clock";
import { TeamConfig } from "./TeamConfig";
import { TeamMember } from "./TeamMember";
import { TeamMetrics } from "./TeamMetrics";

export class Team {
  
    private readonly members : Array<TeamMember>;
    private readonly backlog : Backlog;
    private readonly clock : Clock;

    constructor(teamConfig : TeamConfig, backlog : Backlog, clock : Clock) {
      this.members = teamConfig.Members.map((member, index) => new TeamMember(index, member, teamConfig.Graph));
      this.backlog = backlog;
      this.clock = clock;
    }

    public Work() : TeamMetrics {
      while(!this.backlog.IsCompleted) {
        this.members.forEach(member => member.Work(this.backlog, this.clock));
        this.clock.Tick();
      }
      return new TeamMetrics(this.members.map(member => member.Metrics), this.backlog.Metrics);
    }
    
  }