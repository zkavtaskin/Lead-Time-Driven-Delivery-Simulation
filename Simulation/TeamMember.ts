export class TeamMember {
  
    private id: number;
    private member: any;
    private teamGraph: any;

    constructor(id :number, member:any, teamGraph:any) {
      this.id = id;
      this.member = member;
      this.teamGraph = teamGraph;
    }
  
    public DoWork(backlog :Array<Story>, clock :Clock) :Array<Story> {
      var storiesCompleted = new Array<Story>();
      for(let backlogIndex :number = 0, timeRemaining :number = this.member.Capacity * clock.IntervalSize; timeRemaining != 0 && backlogIndex < backlog.length; backlogIndex++) {
          
          let story :Story = backlog[backlogIndex];
  
          if(!story.HasWork(this.id))
            continue;
  
          if(!this.myTurnToPickUp(story) || (story.HasPrerequisite() && this.prerequisiteIsNotComplete(story, backlog)))
            continue;
  
          story.Activate(this.id, clock);
          timeRemaining = story.Contribute(this.id, timeRemaining);
  
          this.giveTeamMembersFeedback(story);
  
          if(story.Complete(clock.Ticks)) {
            storiesCompleted.push(story);
          }
      }
      return storiesCompleted;
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
  
    private prerequisiteIsNotComplete(story :Story, backlog :Array<Story>) :boolean {
      //will move to a hashmap 
      for(let backlogIndex:number = 0; backlogIndex < backlog.length; backlogIndex++) {
        if(backlog[backlogIndex].Id == story.PrerequisiteId) {
          return backlog[backlogIndex].IsCompleted();
        }
      }
    }
    
  }