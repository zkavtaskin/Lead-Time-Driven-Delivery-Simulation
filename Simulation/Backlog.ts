import { Story } from "./Story";
import { MemberConfig } from "./MemberConfig";
import { BacklogConfig } from "./BacklogConfig";
import { Task } from "./Task";
import { BacklogStats } from "./BacklogStats";

export class Backlog {

    private stories :Array<Story>;
    private storiesMap : Map<number, Story> = new Map<number, Story>();
    private nextStreakIndex :number = 0;

    constructor(stories :Array<Story>) {
        this.stories = stories;

        for(let i = 0; i < stories.length; i++) {
          this.storiesMap.set(stories[i].Id, stories[i]);
        }
    }

    get IsCompleted() : boolean {
      return this.nextStreakIndex === this.stories.length;
    }

    get Length() : number {
      return this.stories.length;
    }

    *Iterator() : IterableIterator<Story> {
      let onStreak = true;
      for(let i = this.nextStreakIndex; i < this.stories.length; i++) {
          yield this.stories[i];
          if(this.stories[i].IsCompleted() && onStreak) {
            this.nextStreakIndex = i + 1;
            continue;
          } 
          onStreak = false;
        }
    }

    Find(id:number) :Story {
      return this.storiesMap.get(id);
    }

    GetStats() : BacklogStats {
      return new BacklogStats(this.stories);
    }

    public static Generate(memberConfig : Array<MemberConfig>, backlogConfig :BacklogConfig) : Backlog {
        let stories = new Array<Story>();
    
        for(let id:number = 0; id < backlogConfig.NumberOfStories; id++) {

          let hasDeadline:boolean = false;
          if(Math.random() <= backlogConfig.DeadlinesFrequency) {
            hasDeadline = true;
          }
    
          let prerequisiteStoryId:number | null = null;
          if(Math.random() <= backlogConfig.DependenciesFrequency && id > 0) {
            while(prerequisiteStoryId == null || prerequisiteStoryId == id) {
              prerequisiteStoryId = Math.floor(Math.random() * id);
            }
          }
    
          let storySize = backlogConfig.MinStorySize + (Math.random() * (backlogConfig.MaxStorySize - backlogConfig.MinStorySize));
          let tasks = new Array<Task>();
          memberConfig.forEach((member :MemberConfig, index:number) => {
            if(Math.random() <= member.BacklogFrequency) {
              let effort:number = member.BacklogContribution * storySize;
              tasks.push(new Task(effort));
    
            } else {
              tasks.push(null);
            }
          });
    
          stories.push(new Story(id, hasDeadline, prerequisiteStoryId, tasks));
        }
  
        return new Backlog(stories);
    }

}