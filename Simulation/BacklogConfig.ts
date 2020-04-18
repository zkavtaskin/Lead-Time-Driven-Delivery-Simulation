export class BacklogConfig {
    
    readonly NumberOfStories :number;
    readonly DependenciesFrequency :number;
    readonly DeadlinesFrequency :number;
    readonly StorySize :number;

    constructor(numberOfStories :number, dependenciesFrequency :number, deadlinesFrequency :number, storySize :number) {
        this.NumberOfStories = numberOfStories;
        this.DeadlinesFrequency = deadlinesFrequency;
        this.DependenciesFrequency = dependenciesFrequency;
        this.StorySize = storySize;
    }


}