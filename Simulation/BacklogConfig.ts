import { Story } from "./Story";

export class BacklogConfig {

    readonly NumberOfStories :number;
    readonly StoryDependenciesFrequency :number;
    readonly DeadlinesFrequency :number;
    readonly MinStorySize :number;
    readonly MaxStorySize :number;

    constructor(numberOfStories :number, storyDependenciesFrequency :number, deadlinesFrequency :number, minStorySize :number, maxStorySize :number = minStorySize) {
        this.NumberOfStories = numberOfStories;
        this.DeadlinesFrequency = deadlinesFrequency;
        this.StoryDependenciesFrequency = storyDependenciesFrequency;

        if(0 > minStorySize)
            throw Error("Min story size can not be less than 0.")

        if(minStorySize > maxStorySize)
            throw Error("Max story size can not be less than min story size.");

        this.MinStorySize = minStorySize;
        this.MaxStorySize = maxStorySize;
    }


}