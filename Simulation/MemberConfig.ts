class MemberConfig {

    readonly Name :string;
    readonly Capacity :number;
    readonly BacklogFrequency :number;
    readonly BacklogContribution: number;

    constructor(name :string, capacity :number, backlogFrequence :number, backlogContribution :number) {
        this.Name = name;
        this.Capacity = capacity;
        this.BacklogFrequency = backlogFrequence;
        this.BacklogContribution = backlogContribution;
    }
}