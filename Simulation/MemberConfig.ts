export class MemberConfig {

    readonly Name :string;
    
    //Ratio of how many hours member has to do the work e.g. 10 hours out of 37 hour week would be 10/37
    Capacity :number;
    
    //Ratio of how often work is assigned for this individual .e.g. 1 story out of 20 is assigned would be 1/20
    readonly BacklogFrequency :number;

    //Ratio of "weight" for the story e.g. if this team member does 50% of the work and the rest of the team does 50% then this would be 50/100.
    readonly BacklogContribution: number;

    constructor(name :string, capacity :number, backlogFrequency :number, backlogContribution :number) {
        this.Name = name;
        this.Capacity = capacity;
        this.BacklogFrequency = backlogFrequency;
        this.BacklogContribution = backlogContribution;
    }
}