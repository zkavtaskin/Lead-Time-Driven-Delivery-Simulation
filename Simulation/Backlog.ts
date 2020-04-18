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

    constructor(stories :Array<Story>, stats :Array<MemberStats>) {
        this.Stories = stories;
        this.Stats = stats;
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
    
          let prerequisiteStoryId:number | null = null;
          if(Math.random() <= backlogConfig.DependenciesFrequency && backlogConfig.NumberOfStories > 1) {
            while(prerequisiteStoryId == null || prerequisiteStoryId == id)
              prerequisiteStoryId = Math.floor(Math.random() * backlogConfig.NumberOfStories);
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