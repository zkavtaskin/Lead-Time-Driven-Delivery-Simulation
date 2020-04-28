import { Clock } from "./Clock";
import { Backlog } from "./Backlog";
import { MemberConfig } from "./MemberConfig";

export class TeamMember {
  
    private id: number;
    private member: MemberConfig;
    private teamGraph: Array<Array<number>>;

    constructor(id :number, member:MemberConfig, teamGraph: Array<Array<number>>) {
      this.id = id;
      this.member = member;
      this.teamGraph = teamGraph;
    }
  
    public DoWork(backlog :Backlog, clock :Clock) : void{
      let timeRemaining :number = this.member.Capacity * clock.EffortSize;
      let feedbackGivenDuringTheTick = false;
      for(let story of backlog.Iterator()){

        if(timeRemaining == 0) break;

        //make sure dependencies are completed
        if((story.HasPrerequisite() && !backlog.Find(story.PrerequisiteId).IsCompleted)) continue;

        //ensure it is team members turn
        let storyHasUpstreamwork = false;
        for(let priorTeamMemberId:number = 0; priorTeamMemberId < this.id; priorTeamMemberId++) {
          if(this.teamGraph[this.id][priorTeamMemberId] == 1 && story.HasWork(priorTeamMemberId)) {
            storyHasUpstreamwork = true;
            break;
          }
        }
        if(storyHasUpstreamwork) continue;

        if(!story.HasWork(this.id)) continue;
        
        story.Activate(this.id, clock.Ticks);
        timeRemaining = story.Contribute(this.id, timeRemaining);

        //give upstream team members feedback
        for(let priorTeamMemberId:number = this.id-1; priorTeamMemberId >= 0 && !feedbackGivenDuringTheTick; priorTeamMemberId--) {
          let feedbackRatio = this.teamGraph[priorTeamMemberId][this.id];
          if(story.Tasks[priorTeamMemberId] != null && Math.random() <= feedbackRatio) {
            let extraEffort:number = Math.ceil(Math.random() * 0.2 * story.Tasks[priorTeamMemberId].Original);
            story.AddWork(priorTeamMemberId, extraEffort);
            feedbackGivenDuringTheTick = true;
          }
        }

        story.Complete(clock.Ticks);
      }
    }
    
  }