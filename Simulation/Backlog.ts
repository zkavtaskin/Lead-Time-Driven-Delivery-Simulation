import { Story } from "./Story";
import { MemberConfig } from "./MemberConfig";
import { BacklogConfig } from "./BacklogConfig";
import { Task } from "./Task";

class MemberStats {
    AverageValue :number | null = 0;
    NumberOfStories :number  = 0;
}

export class Backlog {

    readonly Stats :Array<MemberStats>;

    private stories :Array<Story>;
    private storiesMap : Map<number, Story> = new Map<number, Story>();
    private storiesCompleted: number = 0;
    private nextStreakIndex :number = 0;

    constructor(stories :Array<Story>, stats :Array<MemberStats>) {
        this.stories = stories;

        for(let i = 0; i < stories.length; i++) {
          this.storiesMap.set(stories[i].Id, stories[i]);
        }

        this.Stats = stats;
    }

    get IsCompleted() : boolean {
      return this.storiesCompleted == this.stories.length;
    }

    get Length() : number {
      return this.stories.length;
    }

    *Iterator() : IterableIterator<Story> {
      let onStreak = true;
      for(let i = this.nextStreakIndex; i < this.stories.length; i++) {
          if(this.stories[i].IsCompleted() && onStreak) {
            this.nextStreakIndex = i + 1;
            continue;
          } 
          onStreak = false;
          yield this.stories[i];
          if(this.stories[i].IsCompleted) {
            this.storiesCompleted++;
          }
        }
    }

    Find(id:number) :Story {
      return this.storiesMap.get(id);
    }

    public static Generate(memberConfig : Array<MemberConfig>, backlogConfig :BacklogConfig) : Backlog {
        let stories = new Array<Story>();
        let memberStats = new Array<MemberStats>();
  
        memberConfig.forEach((member, index) => memberStats[index] = new MemberStats());
    
        for(let id:number = 0; id < backlogConfig.NumberOfStories; id++) {

          let hasDeadline:boolean = false;
          if(Math.random() <= backlogConfig.DeadlinesFrequency) {
            hasDeadline = true;
          }
    
          let prerequisiteStoryId:number | null = null;
          let numberOfStoriesUpFront = backlogConfig.NumberOfStories - (id + 1);
          if(Math.random() <= backlogConfig.DependenciesFrequency && numberOfStoriesUpFront > 0) {
            while(prerequisiteStoryId == null || prerequisiteStoryId == id) {
              prerequisiteStoryId = (id + 1) + Math.floor(Math.random() * numberOfStoriesUpFront);
            }
          }
    
          let tasks = new Array<Task>();
          memberConfig.forEach((member :MemberConfig, index:number) => {
            if(Math.random() <= member.BacklogFrequency) {
              let effort:number = Math.ceil(Math.random() * member.BacklogContribution * backlogConfig.StorySize);
              tasks.push(new Task(effort));
              memberStats[index].AverageValue += effort;
              memberStats[index].NumberOfStories++;
    
            } else {
              tasks.push(null);
            }
          });
    
          stories.push(new Story(id, hasDeadline, prerequisiteStoryId, tasks));
        }
    
        memberConfig.forEach((member :MemberConfig, index :number) => {
          memberStats[index].AverageValue = memberStats[index].AverageValue / memberStats[index].NumberOfStories;
        });
  
        return new Backlog(stories, memberStats);
    }

}