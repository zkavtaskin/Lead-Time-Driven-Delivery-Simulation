
export class Data {
    public readonly LeadTime : Array<number>;
    public readonly CycleTime : Array<number>;
    public readonly Conditions : Array<[string, string]>;

    constructor(leadTime: Array<number>, cycleTime: Array<number>, conditions:Array<[string, string]>) {
        this.LeadTime = leadTime;
        this.CycleTime = cycleTime;
        this.Conditions = conditions;
    }
}