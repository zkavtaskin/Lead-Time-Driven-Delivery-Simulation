import { Task } from "./Task";
import { Clock } from "./Clock";

export class Story {

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

    get StartedTick() : number {
      return this.startedTick;
    }
    
    get CycleTime() : number | null {
        if(this.completedTick && this.startedTick)
            return this.completedTick - this.startedTick;

        return null;
    }
  
    Activate(teamMemberId : number, clock : Clock) : void {
      if(this.Tasks[teamMemberId] != null && this.Tasks[teamMemberId].Remaining == this.Tasks[teamMemberId].Original && this.startedTick == null) {
        this.startedTick = clock.Ticks;
      }
    }
  
    HasPrerequisite() : boolean {
      return this.prerequisiteId != null;
    }
  
    Complete(ticks : number) : boolean {
      if(this.completedTick != null)
        return false;

      for(var i = 0; i < this.tasks.length; i++) {
        if(this.tasks[i] != null && this.tasks[i].Remaining > 0)
          return false;
      }
      this.completedTick = ticks;
      return true;
    }
  
    HasWork(teamMemberId : number) : boolean {
      return this.tasks[teamMemberId] != null && this.tasks[teamMemberId].Remaining > 0;
    }
  
    Contribute(teamMemberId : number, effort : number) : number {
      this.tasks[teamMemberId].Remaining -= effort;
      if(0 > this.tasks[teamMemberId].Remaining) {
        effort = -this.tasks[teamMemberId].Remaining;
        this.tasks[teamMemberId].Remaining = 0;
      } else {
        effort = 0;
      }
      return effort;
    }
  
    AddWork(teamMemberId : number, effort : number) : void {
      this.tasks[teamMemberId].Remaining += effort;
      this.tasks[teamMemberId].Actual += effort;
    }
  
    IsCompleted() : boolean{
      return this.completedTick != null;
    }
  }