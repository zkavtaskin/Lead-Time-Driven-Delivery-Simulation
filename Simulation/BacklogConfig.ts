import { Story } from "./Story";

export class BacklogConfig {

    readonly NumberOfStories :number;
    readonly StoryDependenciesFrequency :number;
    readonly DeadlinesFrequency :number;
    readonly MinStorySize :number;
    readonly MaxStorySize :number;
    readonly StorySizeGenerator: () => number;

    constructor(numberOfStories :number, storyDependenciesFrequency :number, deadlinesFrequency :number, minStorySize :number, maxStorySize :number = minStorySize, storySizeGenerator : () => number = null) {
        this.NumberOfStories = numberOfStories;
        this.DeadlinesFrequency = deadlinesFrequency;
        this.StoryDependenciesFrequency = storyDependenciesFrequency;

        if(0 > minStorySize && storySizeGenerator == null)
            throw Error("Min story size can not be less than 0.")

        if(minStorySize > maxStorySize && storySizeGenerator == null)
            throw Error("Max story size can not be less than min story size.");

        this.MinStorySize = minStorySize;
        this.MaxStorySize = maxStorySize;
        this.StorySizeGenerator = storySizeGenerator;
    }


}