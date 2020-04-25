export class BacklogConfig {
    
    readonly NumberOfStories :number;
    readonly DependenciesFrequency :number;
    readonly DeadlinesFrequency :number;
    readonly MinStorySize :number;
    readonly MaxStorySize :number;

    constructor(numberOfStories :number, dependenciesFrequency :number, deadlinesFrequency :number, minStorySize :number, maxStorySize :number) {
        this.NumberOfStories = numberOfStories;
        this.DeadlinesFrequency = deadlinesFrequency;
        this.DependenciesFrequency = dependenciesFrequency;
        this.MinStorySize = minStorySize;
        this.MaxStorySize = maxStorySize;
    }


}