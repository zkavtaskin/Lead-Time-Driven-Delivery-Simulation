import { Story } from "./Story";
import * as simplestats from 'simple-statistics'
import { Statistics } from "./Statistics";
import { StatisticsDescriptive } from "./StatisticsDescriptive";


export class BacklogRuntimeMetrics {
    public readonly CycleTime : StatisticsDescriptive;
    public readonly LeadTime : StatisticsDescriptive;

    constructor(stories: Array<Story>) {

        if(stories == null || 0 >= stories.length) {
            throw new Error("Stories need to be provided");
        }

        if(0 >= stories[0].Tasks.length) {
            throw new Error("Tasks need to be provided");
        }

        this.CycleTime = this.describe(stories.map((s) => s.CycleTime));
        this.LeadTime = this.describe(stories.map((s) => s.LeadTime));
    }

    private describe(x : Array<number>) {
        const description = new StatisticsDescriptive();
        description.Count = x.length;
        description.Mean = BacklogRuntimeMetrics.toDecimalPlace(simplestats.mean(x));
        description.Median = BacklogRuntimeMetrics.toDecimalPlace(simplestats.median(x));
        description.Sum = BacklogRuntimeMetrics.toDecimalPlace(simplestats.sum(x));
        description.Min = BacklogRuntimeMetrics.toDecimalPlace(simplestats.min(x));
        description.Max = BacklogRuntimeMetrics.toDecimalPlace(simplestats.max(x));
        description.Std =  BacklogRuntimeMetrics.toDecimalPlace(simplestats.standardDeviation(x));
        description.Variance = BacklogRuntimeMetrics.toDecimalPlace(simplestats.variance(x));
        description.Skew = BacklogRuntimeMetrics.toDecimalPlace(simplestats.sampleSkewness(x));
        description.Kurtosis = BacklogRuntimeMetrics.toDecimalPlace(simplestats.sampleKurtosis(x));
        description.Frequency = Statistics.FrequencyTest(x, 100);
        return description;
    }

    private static toDecimalPlace(value : number, decimalPlaces : number = 1) : number {
        const diviser =  Math.pow(10, decimalPlaces);
        return Math.round((value + Number.EPSILON) * diviser) / diviser;
    }
}