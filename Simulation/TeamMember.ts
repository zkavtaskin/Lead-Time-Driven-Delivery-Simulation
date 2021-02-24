import { Clock } from "./Clock";
import { Backlog } from "./Backlog";
import { MemberConfig } from "./MemberConfig";
import { TeamMemberMetrics } from "./TeamMemberMetrics";

export class TeamMember {
  
    private id: number;
    private member: MemberConfig;
    private teamGraph: Array<Array<number>>;
    private timeIdle: number = 0;
    private skipPrerequisite: number = 0;
    private skipNotMyTurn: number = 0;
    private givenFeedback : number = 0;
    private feedbackGiven : Map<number, boolean> = new Map<number, boolean>();

    get Metrics() : TeamMemberMetrics {
      return new TeamMemberMetrics(this.id, this.member.Name, this.timeIdle, this.skipPrerequisite, this.skipNotMyTurn, this.givenFeedback);
    }

    constructor(id :number, member:MemberConfig, teamGraph: Array<Array<number>>) {
      this.id = id;
      this.member = member;
      this.teamGraph = teamGraph;
    }

    public Work(backlog :Backlog, clock :Clock) : void {
      let timeRemaining :number = this.member.Capacity * clock.EffortSize;

      for(let story of backlog.Iterator()) {
        if(timeRemaining == 0) {
          break;
        }
      
        //make sure dependencies are completed
        if((story.HasPrerequisite && !backlog.Find(story.PrerequisiteId).IsCompleted)) {
          this.skipPrerequisite++;
          continue;
        }

        //ensure it is "my" turn
        let storyHasUpstreamWork = false;
        for(let priorTeamMemberId:number = 0; priorTeamMemberId < this.id; priorTeamMemberId++) {
          if(this.teamGraph[this.id][priorTeamMemberId] == 1 && story.HasWork(priorTeamMemberId)) {
            storyHasUpstreamWork = true;
            break;
          }
        }

        if(storyHasUpstreamWork) {
          this.skipNotMyTurn++;
          continue;
        }

        if(!story.HasWork(this.id)) {
          continue;
        }

        story.Activate(this.id, clock.Ticks);
        timeRemaining = story.Contribute(this.id, timeRemaining);

        for(let teamMemberRow:number = this.id-1; teamMemberRow >= 0 && !this.feedbackGiven.has(story.Id); teamMemberRow--) {
          const feedbackRatio = this.teamGraph[teamMemberRow][this.id];
          if(story.Tasks[teamMemberRow] != null && feedbackRatio >= Math.random()) { 
            this.givenFeedback++;
            //give upstream team members feedback, 0.2 is the upper bound max feedback
            const extraEffort = Math.ceil((Math.random() * 0.2) * story.Tasks[teamMemberRow].Original);
            story.AddWork(teamMemberRow, extraEffort);
            break;
          }
        }
        this.feedbackGiven.set(story.Id, true);

        story.Complete(clock.Ticks);
      }
      this.timeIdle += timeRemaining;
    }
    
  }