import { Story } from "./Story";
import * as simplestats from 'simple-statistics'
import { Statistics } from "./Statistics";
import { StatisticsDescriptive } from "./StatisticsDescriptive";


export class BacklogRuntimeMetrics {
    public readonly CycleTime : StatisticsDescriptive;
    public readonly LeadTime : StatisticsDescriptive;
    public readonly CycleTimeData : Array<number>;
    public readonly LeadTimeData : Array<number>;

    constructor(stories: Array<Story>) {

        if(stories == null || 0 >= stories.length) {
            throw new Error("Stories need to be provided");
        }

        if(0 >= stories[0].Tasks.length) {
            throw new Error("Tasks need to be provided");
        }

        this.CycleTimeData = stories.map((s) => s.CycleTime);
        this.CycleTime = this.describe(this.CycleTimeData);

        this.LeadTimeData = stories.map((s) => s.LeadTime);
        this.LeadTime = this.describe(this.LeadTimeData);
    }

    private describe(x : Array<number>) {
        const description = new StatisticsDescriptive();
        description.Count = x.length;
        description.Mean = Statistics.toDecimalPlace(simplestats.mean(x));
        description.Median = Statistics.toDecimalPlace(simplestats.median(x));
        description.Sum = Statistics.toDecimalPlace(simplestats.sum(x));
        description.Min = Statistics.toDecimalPlace(simplestats.min(x));
        description.Max = Statistics.toDecimalPlace(simplestats.max(x));
        description.Std =  Statistics.toDecimalPlace(simplestats.standardDeviation(x));
        description.Variance = Statistics.toDecimalPlace(simplestats.variance(x));
        description.Skew = Statistics.toDecimalPlace(simplestats.sampleSkewness(x));
        description.Kurtosis = Statistics.toDecimalPlace(simplestats.sampleKurtosis(x));
        description.Frequency = Statistics.toDecimalPlace(Statistics.FrequencyTest(x, 100));
        description.Histogram = Statistics.Histogram(x, 1000);
        description.HistogramRange = 1000;
        return description;
    }
}