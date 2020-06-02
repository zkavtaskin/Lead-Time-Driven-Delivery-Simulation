import { Story } from "./Story";
import * as simplestats from 'simple-statistics'

export class BacklogStats {

    readonly TeamMembersOriginal : Array<Summary>;
    readonly TeamMembersActual : Array<Summary>;
    readonly CycleTime : Summary;
    readonly LeadTime : Summary;

    constructor(stories: Array<Story>) {

        if(stories == null || 0 >= stories.length)
            throw new Error("Stories need to be provided");

        if(0 >= stories[0].Tasks.length)
            throw new Error("Tasks need to be provided");

        const numOfMembers = stories[0].Tasks.length;
        this.TeamMembersOriginal = new Array<Summary>(numOfMembers);
        this.TeamMembersActual = new Array<Summary>(numOfMembers); 

        let cycleTime = Array<number>(), 
            leadTime = Array<number>(), 
            teamMembersOriginal = new Array<Array<number>>(numOfMembers).fill(new Array<number>()),
            teamMembersActual = new Array<Array<number>>(numOfMembers).fill(new Array<number>());
            
        stories.forEach(story => {
            cycleTime.push(story.CycleTime);
            leadTime.push(story.CycleTime + story.StartedTick);

            story.Tasks.forEach((task, index) => {
                if(task != null) {
                    teamMembersOriginal[index].push(task.Original);
                    teamMembersActual[index].push(task.Actual);
                }
            });

        });
        this.CycleTime = this.getSummary(cycleTime);
        this.LeadTime = this.getSummary(leadTime);

        for(let i = 0; i < stories[0].Tasks.length; i++) {
            this.TeamMembersOriginal[i] = this.getSummary(teamMembersOriginal[i]);
            this.TeamMembersActual[i] = this.getSummary(teamMembersActual[i]);
        }

    }


    /**
     * t-Test that performs Null Hypothesis test.
     * @param sampleMean 
     * @param sampleStd 
     * @param numberOfSamples 
     * @param expectationMean 
     * @param alpha 
     * @returns false if there is negative significance and true if there is positive significance. Null is returned when Null Hypothesis is true.
     */
    public static GetSignificance(sampleMean : number, sampleStd : number, numberOfSamples : number, expectationMean : number, alpha  : number = 0.05) : boolean | null {
    
        const z = (sampleMean - expectationMean) / (sampleStd / Math.sqrt(numberOfSamples));
        const zAbs = Math.abs(z);
        //zTable regression approximation
        const p = 0.5-(-0.0109+0.4913*zAbs-0.1567*Math.pow(zAbs,2)+0.0165*Math.pow(zAbs,3));

        if(z > 0 && alpha > p)
            return true;
        
        if(z < 0 && alpha > p)
            return false;

        return null;
    }

    /**
     * Two sample t-Test that performs Null Hypothesis for two samples, two samples must be same size.
     * @param summaryA 
     * @param summaryB 
     * @param alpha 
     * @returns false if there is negative significance and true if there is positive significance. Null is returned when Null Hypothesis is true.
     */
    public static TwoSampleTest(summaryA : Summary, summaryB : Summary, alpha : number = 0.05) {
        if(summaryA.Count != summaryB.Count || summaryA.Count < 1) {
            throw new Error("count must be the same for summary A and B and count must be greater then 0");
        }

        const meanDifference = summaryA.Mean - summaryB.Mean;
        const denominator = Math.sqrt((summaryA.Variance + summaryB.Variance) / 2) * Math.sqrt(2 / summaryA.Count);
        const z = meanDifference / denominator;
        const zAbs = Math.abs(z);
        //zTable regression approximation
        const p = 0.5-(-0.0109+0.4913*zAbs-0.1567*Math.pow(zAbs,2)+0.0165*Math.pow(zAbs,3));
        
        if(z > 0 && alpha > p)
        return true;
    
        if(z < 0 && alpha > p)
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
        return summary;
    }

    private toDecimalPlace(value : number, decimalPlaces : number = 1) : number {
        const diviser =  Math.pow(10, decimalPlaces);
        return Math.round((value + Number.EPSILON) * diviser) / diviser;
    }

}

export class Summary {
    Count :number;
    Sum   :number;
    Min : number;
    Max : number;
    Mean :number;
    Median : number;
    Std : number;
    Variance : number;

    constructor(count : number = 0, sum : number = 0, min : number = 0, max : number = 0, mean : number = 0, median : number = 0, std : number = 0, variance : number = 0) {
        this.Count = count;
        this.Sum = sum;
        this.Min = min;
        this.Max = max;
        this.Mean = mean;
        this.Median = median;
        this.Std = std;
        this.Variance = variance;
    }

}