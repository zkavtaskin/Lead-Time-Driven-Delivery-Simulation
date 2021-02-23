import { Story } from "./Story";
import { Statistics } from "./Statistics";
import { StatisticsDescriptive } from "./StatisticsDescriptive";


export class BacklogRuntimeMetrics {
    public readonly CycleTime : StatisticsDescriptive;
    public readonly LeadTime : StatisticsDescriptive;
    public readonly CycleTimeData : Array<number>;
    public readonly LeadTimeData : Array<number>;
    public readonly SizeOriginal : number;
    public readonly SizeActual : number;

    constructor(stories: Array<Story>) {

        if(stories == null || 0 >= stories.length) {
            throw new Error("Stories need to be provided");
        }

        if(0 >= stories[0].Tasks.length) {
            throw new Error("Tasks need to be provided");
        }

        this.CycleTimeData = stories.map((s) => s.CycleTime);
        this.CycleTime =  Statistics.Describe(this.CycleTimeData);

        this.LeadTimeData = stories.map((s) => s.LeadTime);
        this.LeadTime = Statistics.Describe(this.LeadTimeData);

        this.SizeOriginal = stories.reduce((total, story) => total + story.SizeOriginal, 0);
        this.SizeActual = stories.reduce((total, story) => total + story.SizeActual, 0);
    }
}