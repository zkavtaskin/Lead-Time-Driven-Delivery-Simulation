import { Story } from "./Story";
import * as simplestats from 'simple-statistics'

export class BacklogStats {

    readonly TeamMembers : Array<Summary>;

    constructor(stories: Array<Story>) {
        if(0 > stories.length)
            return;

        if(0 > stories[0].Tasks.length)
            return;

        this.TeamMembers = new Array<Summary>(stories[0].Tasks.length);
        for(let i : number = 0; i < stories[0].Tasks.length; i++) {
            this.TeamMembers[i] = new Summary();
        }

        for(let i : number = 0; i < stories.length; i++) {
            for(let j : number = 0; j < stories[i].Tasks.length; j++) {
                this.TeamMembers[j].Sum +=  stories[i].Tasks[j].Original;
                this.TeamMembers[j].Count++;
                this.TeamMembers[j].Mean = this.TeamMembers[j].Sum / this.TeamMembers[j].Count
            }
        }
    }

}


class Summary {
    Sum   :number | null = 0;
    Mean :number | null = 0;
    Count :number  = 0;
    Median : number | null = 0;
}