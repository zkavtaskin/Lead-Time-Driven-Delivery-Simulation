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

        let numOfMembers = stories[0].Tasks.length;
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

    private getSummary(numbers : Array<number>) {
        let summary = new Summary();
        summary.Count = numbers.length;
        summary.Mean = Math.round((simplestats.mean(numbers) + Number.EPSILON) * 10) / 10;
        summary.Median = simplestats.median(numbers);
        summary.Sum = simplestats.sum(numbers);
        summary.Min = simplestats.min(numbers);
        summary.Max = simplestats.max(numbers);
        return summary;
    }

}

export class Summary {
    Count :number;
    Sum   :number;
    Min : number;
    Max : number;
    Mean :number;
    Median : number;

    constructor(count : number = 0, sum : number = 0, min : number = 0, max : number = 0, mean : number = 0, median : number = 0) {
        this.Count = count;
        this.Sum = sum;
        this.Min = min;
        this.Max = max;
        this.Mean = mean;
        this.Median = median;
    }

}