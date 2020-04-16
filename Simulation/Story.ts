class Story {

    private id: number;
    private deadline:boolean;
    private prerequisiteId:number;
    private tasks:Array<Task>;
    private startedTick:number | null = null;
    private completedTick:number | null = null;

    constructor(id :number, deadline:boolean, prerequisiteId:number, tasks:Array<Task>) {
      this.id = id;
      this.deadline = deadline;
      this.prerequisiteId = prerequisiteId;
      this.tasks = tasks;
    }
  
    get Id() : number {
      return this.id;
    }
  
    get PrerequisiteId() : number {
      return this.prerequisiteId;
    }
  
    get Deadline() : boolean {
      return this.deadline;
    }
  
    get Tasks() : Array<Task> {
      return this.tasks;
    }
    
    get CycleTime() : number | null {
        if(this.completedTick && this.startedTick)
            return this.completedTick - this.startedTick;

        return null;
    }
  
    Activate(taskIndex : number, clock : Clock) : void {
      if(this.Tasks[taskIndex].Remaining == this.Tasks[taskIndex].Original && this.startedTick == null) {
        this.startedTick = clock.Ticks;
      }
    }
  
    HasPrerequisite() : boolean {
      return this.prerequisiteId != null;
    }
  
    Complete(ticks : number) : boolean {
      if(this.allTasksCompleted()) {
        this.completedTick = ticks;
        return true;
      } 
      return false;
    }
  
    HasWork(agentIndex : number) : boolean {
      return this.tasks[agentIndex] != null && this.tasks[agentIndex].Remaining > 0;
    }
  
    Contribute(agentIndex : number, effort : number) : number {
      this.tasks[agentIndex].Remaining -= effort;
      if(0 > this.tasks[agentIndex].Remaining) {
        effort = -this.tasks[agentIndex].Remaining;
        this.tasks[agentIndex].Remaining = 0;
      } else {
        effort = 0;
      }
      return effort;
    }
  
    AddWork(agentIndex : number, effort : number) : void {
      this.tasks[agentIndex].Remaining += effort;
      this.tasks[agentIndex].Actual += effort;
    }
  
    IsCompleted() : boolean{
      return this.completedTick != null;
    }
  
    allTasksCompleted() : boolean {
      for(var i = 0; i < this.tasks.length; i++) {
        if(this.tasks[i] != null && this.tasks[i].Remaining > 0)
          return false;
      }
      return true;
    }
  }