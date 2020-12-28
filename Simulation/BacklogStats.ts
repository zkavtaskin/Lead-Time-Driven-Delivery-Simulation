import { Story } from "./Story";
import * as simplestats from 'simple-statistics'
import { Backlog } from "./Backlog";

export class BacklogStats {
    
    readonly CycleTime : Summary;
    readonly LeadTime : Summary;
    readonly LeadTimeUniformity : number;
    readonly SizeOriginal : number;

    constructor(stories: Array<Story>) {

        if(stories == null || 0 >= stories.length)
            throw new Error("Stories need to be provided");

        if(0 >= stories[0].Tasks.length)
            throw new Error("Tasks need to be provided");

        this.CycleTime = this.getSummary(stories.map((s) => s.CycleTime));
        this.LeadTime = this.getSummary(stories.map((s) => s.LeadTime));
        this.LeadTimeUniformity = BacklogStats.UniformDistribution(stories.map((s) => s.LeadTime), 100);
        this.SizeOriginal = stories.map((s) => s.SizeOriginal).reduce((sum, value) => sum + value);
    }

    /***
     * @description Kurtosis & Skew explanation: https://www.spcforexcel.com/knowledge/basic-statistics/are-skewness-and-kurtosis-useful-statistics**
     * @param kurtosis Kurtosis - "Kurtosis tells you virtually nothing about the shape of the peak – its only unambiguous interpretation is in terms of tail extremity."
     *  The following heuristics will be used: {0..0.5=Normal tail,>1=Not enough tail,-0.3..0=Moderate tail,..<-0.3=Heavy tail}
     * @param skew Skew - "Skewness is usually described as a measure of a dataset’s symmetry – or lack of symmetry.   
     * A perfectly symmetrical data set will have a skewness of 0. The normal distribution has a skewness of 0."
     * The following heuristics will be used: {-0.5..0.5=Normal Skew,-1..-0.5 OR ,0.5..1=Moderate Skew,..<-1 OR >1 =High Skew}
     */
    public static IsNormalDistribution(kurtosis : number, skew : number) : boolean {
        const normalTail = kurtosis <= 0.5 && kurtosis >= -0.3;
        const normalSkew = skew <= 1 && skew >= -1;
        return normalSkew && normalTail;
    }

    /***
     * @description Uniform Distribution test using Chi-Squared test
     * Explanation: https://www.eg.bucknell.edu/~xmeng/Course/CS6337/Note/master/node43.html#:~:text=The%20frequency%20test%20is%20a,and%20the%20theoretical%20uniform%20distribution.
     */
    public static UniformDistribution(numbers : Array<number>, binSize : number) : number {
        const binIntervals = Math.ceil(Math.max(...numbers) / binSize);
        const bins = new Array(binIntervals).fill(0);
        numbers.forEach((number) => bins[Math.floor(number / binSize)]++);
        const chiSquared = bins.reduce((sum, bin) => sum + (((bin-binSize)**2) / binSize));
        return chiSquared;
    }

    /**
     * Two sample t-Test that performs Null Hypothesis for two samples.
     * @param a 
     * @param b 
     * @param alpha 
     * @returns false if there is negative significance and true if there is positive significance. Null is returned when Null Hypothesis is true.
     */
    public static TwoSampleTest(a : Summary, b : Summary, alpha : number = 0.05, twoTail : boolean = true) {

        if(30 > a.Count || 30 > b.Count) 
            throw new Error("Data sample for A and B needs to be greater then 30.");

        const zScore = (a.Mean - b.Mean) / Math.sqrt( a.Variance / a.Count + b.Variance / b.Count );
        const zScoreAbs = Math.abs(zScore);
        
        //zTable regression approximation
        let pValue = 0.5-(-0.0109+0.4913*zScoreAbs-0.1567*Math.pow(zScoreAbs,2)+0.0165*Math.pow(zScoreAbs,3));
        pValue = twoTail ? 2 * pValue : pValue; 

        if(zScore > 0 && alpha > pValue)
            return true;
    
        if(zScore < 0 && alpha > pValue)
            return false;

        return null;
    }

    private getSummary(numbers : Array<number>) {
        const summary = new Summary();
        summary.Count = numbers.length;
        summary.Mean = this.toDecimalPlace(simplestats.mean(numbers));
        summary.Median = this.toDecimalPlace(simplestats.median(numbers));
        summary.Sum = this.toDecimalPlace(simplestats.sum(numbers));
        summary.Min = this.toDecimalPlace(simplestats.min(numbers));
        summary.Max = this.toDecimalPlace(simplestats.max(numbers));
        summary.Std =  this.toDecimalPlace(simplestats.standardDeviation(numbers));
        summary.Variance = this.toDecimalPlace(simplestats.variance(numbers));
        summary.Skew = this.toDecimalPlace(simplestats.sampleSkewness(numbers));
        summary.Kurtosis = this.toDecimalPlace(simplestats.sampleKurtosis(numbers));
        return summary;
    }

    private toDecimalPlace(value : number, decimalPlaces : number = 1) : number {
        const diviser =  Math.pow(10, decimalPlaces);
        return Math.round((value + Number.EPSILON) * diviser) / diviser;
    }

}

export class Summary {
    Mean :number;
    Median : number;
    Std : number;
    Min : number;
    Max : number;
    Skew : number;
    Kurtosis: number;
    Variance : number;
    Count :number;
    Sum   :number;

    constructor(count : number = 0, sum : number = 0, min : number = 0, max : number = 0, mean : number = 0, median : number = 0, std : number = 0, variance : number = 0, skew : number = 0, kurtosis: number = 0) {
        this.Count = count;
        this.Sum = sum;
        this.Min = min;
        this.Max = max;
        this.Mean = mean;
        this.Median = median;
        this.Std = std;
        this.Variance = variance;
        this.Skew = skew;
        this.Kurtosis = kurtosis;
    }

}