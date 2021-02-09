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
        description.Mean = Statistics.ToDecimalPlace(simplestats.mean(x));
        description.Median = Statistics.ToDecimalPlace(simplestats.median(x));
        description.Sum = Statistics.ToDecimalPlace(simplestats.sum(x));
        description.Min = Statistics.ToDecimalPlace(simplestats.min(x));
        description.Max = Statistics.ToDecimalPlace(simplestats.max(x));
        description.Std =  Statistics.ToDecimalPlace(simplestats.standardDeviation(x));
        description.Variance = Statistics.ToDecimalPlace(simplestats.variance(x));
        description.Skew = Statistics.ToDecimalPlace(simplestats.sampleSkewness(x));
        description.Kurtosis = Statistics.ToDecimalPlace(simplestats.sampleKurtosis(x));
        description.HistogramRange = 250;
        description.Histogram = Statistics.Histogram(x, description.HistogramRange);
        description.Frequency = Statistics.ToDecimalPlace(Statistics.FrequencyTestBin(description.Histogram));
        return description;
    }
}