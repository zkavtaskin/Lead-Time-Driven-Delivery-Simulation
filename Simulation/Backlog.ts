import { Story } from "./Story";
import { MemberConfig } from "./MemberConfig";
import { BacklogConfig } from "./BacklogConfig";
import { Task } from "./Task";

class MemberStats {

    AverageValue :number | null = 0;
    NumberOfStories :number  = 0;

}

export class Backlog {
    readonly Stories :Array<Story>;
    readonly Stats :Array<MemberStats>;
    private storiesCompleted: number = 0;
    private nextStreakIndex :number = 0;

    constructor(stories :Array<Story>, stats :Array<MemberStats>) {
        this.Stories = stories;
        this.Stats = stats;
    }

    get IsCompleted() : boolean {
      return this.storiesCompleted == this.Stories.length;
    }

    *Iterator() : IterableIterator<Story> {
      let onStreak = true;
      for(let i = this.nextStreakIndex; i < this.Stories.length; i++) {
          if(this.Stories[i].IsCompleted() && onStreak) {
            this.nextStreakIndex = i + 1;
            continue;
          } 
          onStreak = false;
          yield this.Stories[i];
          if(this.Stories[i].IsCompleted) {
            this.storiesCompleted++;
          }
        }
    }

    public static Generate(teamMembers : Array<MemberConfig>, backlogConfig :BacklogConfig) : Backlog {
        let stories = new Array<Story>();
        let memberStats = new Array<MemberStats>();
  
        teamMembers.forEach((member, index) => memberStats[index] = new MemberStats());
    
        for(let id:number = 0; id < backlogConfig.NumberOfStories; id++) {

          let hasDeadline:boolean = false;
          if(Math.random() <= backlogConfig.DeadlinesFrequency) {
            hasDeadline = true;
          }
    
          //forward only dependency
          let prerequisiteStoryId:number | null = null;
          let numberOfStoriesUpFront = backlogConfig.NumberOfStories - (id + 1);
          if(Math.random() <= backlogConfig.DependenciesFrequency && numberOfStoriesUpFront > 0) {
            while(prerequisiteStoryId == null || prerequisiteStoryId == id) {
              prerequisiteStoryId = (id + 1) + Math.floor(Math.random() * numberOfStoriesUpFront);
            }
          }
    
          let tasks = new Array<Task>();
          teamMembers.forEach((member :MemberConfig, index:number) => {
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
    
        teamMembers.forEach((member :MemberConfig, index :number) => {
          memberStats[index].AverageValue = memberStats[index].AverageValue / memberStats[index].NumberOfStories;
        });
  
        return new Backlog(stories, memberStats);
    }

}