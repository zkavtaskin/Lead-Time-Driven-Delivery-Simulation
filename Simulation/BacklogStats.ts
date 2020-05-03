import { Story } from "./Story";
import * as simplestats from 'simple-statistics'

export class BacklogStats {

    readonly TeamMembersOriginal : Array<Summary>;
    readonly TeamMembersActual : Array<Summary>;
    readonly CycleTime : Summary;
    readonly LeadTime : Summary;

    constructor(stories: Array<Story>) {
        if(0 > stories.length)
            return;

        if(0 > stories[0].Tasks.length)
            return;

        let cycleTime = Array<number>();
        let leadTime = Array<number>();
        stories.forEach(story => {
            cycleTime.push(story.CycleTime);
            leadTime.push(story.CycleTime + story.StartedTick);
        });
        this.CycleTime = this.getSummary(cycleTime);
        this.LeadTime = this.getSummary(leadTime);

        this.TeamMembersOriginal = new Array<Summary>(stories[0].Tasks.length);
        this.TeamMembersActual = new Array<Summary>(stories[0].Tasks.length);
        for(let i : number = 0; i < stories[0].Tasks.length; i++) {
            this.TeamMembersOriginal[i] = new Summary();
            this.TeamMembersActual[i] = new Summary();
        }

        for(let i : number = 0; i < stories.length; i++) {
            for(let j : number = 0; j < stories[i].Tasks.length; j++) {

                if(stories[i].Tasks[j] == null) 
                    continue;

                this.TeamMembersOriginal[j].Sum +=  stories[i].Tasks[j].Original;
                this.TeamMembersOriginal[j].Count++;
                this.TeamMembersOriginal[j].Mean = this.TeamMembersOriginal[j].Sum / this.TeamMembersOriginal[j].Count
                

                this.TeamMembersActual[j].Sum +=  stories[i].Tasks[j].Actual;
                this.TeamMembersActual[j].Count++;
                this.TeamMembersActual[j].Mean = this.TeamMembersActual[j].Sum / this.TeamMembersActual[j].Count
            }
        }
    }

    private getSummary(numbers : Array<number>) {
        let summary = new Summary();
        summary.Count = numbers.length;
        summary.Mean = simplestats.mean(numbers);
        summary.Median = simplestats.median(numbers);
        summary.Sum = simplestats.sum(numbers);
        summary.Min = simplestats.min(numbers);
        summary.Max = simplestats.max(numbers);
        return summary;
    }

}


class Summary {
    Sum   :number = 0;
    Mean :number = 0;
    Count :number  = 0;
    Median : number = 0;
    Min : number = 0;
    Max : number = 0;
}