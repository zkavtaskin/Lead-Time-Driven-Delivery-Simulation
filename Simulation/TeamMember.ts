import { Story } from "./Story";
import { Clock } from "./Clock";
import { Backlog } from "./Backlog";

export class TeamMember {
  
    private id: number;
    private member: any;
    private teamGraph: any;

    constructor(id :number, member:any, teamGraph:any) {
      this.id = id;
      this.member = member;
      this.teamGraph = teamGraph;
    }
  
    public DoWork(backlog :Backlog, clock :Clock) : void{
      let timeRemaining :number = this.member.Capacity * clock.IntervalSize;
      for(let story of backlog.Iterator()){

        if(timeRemaining == 0)
          break;

        if(!story.HasWork(this.id))
          continue;

        if(!this.myTurnToPickUp(story) || (story.HasPrerequisite() && this.prerequisiteIsNotComplete(story, backlog)))
          continue;

        story.Activate(this.id, clock);
        timeRemaining = story.Contribute(this.id, timeRemaining);

        this.giveTeamMembersFeedback(story);

        story.Complete(clock.Ticks);
      }
    }
  
    private giveTeamMembersFeedback(story :Story) :void {
      for(let priorTeamMemberId:number = this.id-1; priorTeamMemberId >= 0; priorTeamMemberId--) {
        let feedbackRatio = this.teamGraph[priorTeamMemberId][this.id];
        if(story.Tasks[priorTeamMemberId] != null && Math.random() <= feedbackRatio) {
          let extraEffort:number = Math.ceil(Math.random() * 0.2 * story.Tasks[priorTeamMemberId].Original);
          story.AddWork(priorTeamMemberId, extraEffort);
        }
      }
    }
  
    private myTurnToPickUp(story :Story) :boolean {
      for(let priorTeamMemberId:number = 0; priorTeamMemberId < this.id; priorTeamMemberId++) {
        if(this.teamGraph[this.id][priorTeamMemberId] == 1 && story.HasWork(priorTeamMemberId))
          return false;
      }
      return true;
    }
  
    private prerequisiteIsNotComplete(story :Story, backlog :Backlog) :boolean {
      //will move to a hashmap 
      for(let backlogIndex:number = 0; backlogIndex < backlog.Stories.length; backlogIndex++) {
        if(backlog.Stories[backlogIndex].Id == story.PrerequisiteId) {
          return backlog.Stories[backlogIndex].IsCompleted();
        }
      }
    }
    
  }