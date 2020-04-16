class TeamSimulation {

    private name :string;
    private teamConfig :any;
    private backlogConfig :BacklogCofig;
    private intervalSize :number;

    constructor(name :string, teamConfig :any, backlogConfig :BacklogCofig,  intervalSize :number) {
      this.name = name;
      this.intervalSize = intervalSize;
      this.teamConfig = teamConfig;
      this.backlogConfig = backlogConfig;
    }
  
    public Run() {
      let clock:Clock = new Clock(this.intervalSize);
      let work = this.generateBacklog(teamConfig.Members, backlogConfig);
      let teamMembers:Array<TeamMember> = this.setupTeamMembers(teamConfig, clock);
      this.calibrateGraphFeedback(teamConfig.Graph, work.Stats, clock);
  
      for(let completed:number = 0; work.Stories.length != completed; clock.Tick()) {
        teamMembers.forEach((member) => completed += member.DoWork(work.Stories, clock).length);
      }
  
      return work;
    }
  
    private setupTeamMembers(teamConfig, clock :Clock) : Array<TeamMember> {
      var teamMembers = new Array<TeamMember>();
      teamConfig.Members.forEach((member, index) => 
          teamMembers.push(new TeamMember(index, member, teamConfig.Graph)));
      return teamMembers;
    }
  
    private generateBacklog(teamMembers : Array<MemberConfig>, backlogConfig :BacklogCofig) : Backlog {  
      let stories = new Array<Story>();
      let memberStats = new Array<MemberStats>();

      teamMembers.forEach((member, index) => memberStats[index] = new MemberStats());
  
      for(let id:number = 0; id < backlogConfig.NumberOfStories; id++) {
        let hasDeadline:boolean = false;
        if(Math.random() <= backlogConfig.DeadlinesFrequency) {
          hasDeadline = true;
        }
  
        let prerequisiteStoryId:number | null = null;
        if(Math.random() <= backlogConfig.DependenciesFrequency) {
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
  
    private calibrateGraphFeedback(graph :any, stats :any, clock :Clock) :void {
      graph.forEach((row, rowIndex) => {
        for(let columnIndex:number = rowIndex; columnIndex < graph.lenght; columnIndex++) {
          graph[rowIndex][columnIndex] = (clock.IntervalSize / stats[rowIndex].Value) * graph[rowIndex][columnIndex];
        }
      });
    }
  
  }