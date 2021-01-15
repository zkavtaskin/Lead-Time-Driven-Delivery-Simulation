import { Backlog } from "./Backlog";
import { Story } from "./Story";

export class BacklogConfig {

    readonly NumberOfStories :number;
    readonly StoryDependenciesFrequency :number;
    readonly DeadlinesFrequency :number;
    //todo: hide below properties 
    readonly MinStorySize :number;
    readonly MaxStorySize :number;
    private readonly storySizeGenerator: () => number;

    constructor(numberOfStories :number, storyDependenciesFrequency :number, deadlinesFrequency :number, minStorySize :number, maxStorySize :number = minStorySize, storySizeGenerator : () => number = null) {
        this.NumberOfStories = numberOfStories;
        this.DeadlinesFrequency = deadlinesFrequency;
        this.StoryDependenciesFrequency = storyDependenciesFrequency;
        this.storySizeGenerator = storySizeGenerator;
        
        if(0 > minStorySize && storySizeGenerator == null)
            throw Error("Min story size can not be less than 0.")

        if(minStorySize > maxStorySize && storySizeGenerator == null)
            throw Error("Max story size can not be less than min story size.");

        this.MinStorySize = minStorySize;
        this.MaxStorySize = maxStorySize;
    }

    public GenerateStorySize() : number {
        if(this.storySizeGenerator == null) {
            return this.MinStorySize + (Math.random() * (this.MaxStorySize - this.MinStorySize));
        }
        return this.storySizeGenerator();
    }

    public Copy() : BacklogConfig { 
        return new BacklogConfig(this.NumberOfStories, this.StoryDependenciesFrequency, this.DeadlinesFrequency, this.MinStorySize, this.MaxStorySize, this.storySizeGenerator);
    }

}