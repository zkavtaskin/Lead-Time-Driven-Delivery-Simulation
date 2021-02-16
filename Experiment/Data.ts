import { TeamMemberMetrics } from "../Simulation/TeamMemberMetrics";

export class Data {
    public readonly LeadTime : Array<number>;
    public readonly CycleTime : Array<number>;
    public readonly TeamMembers : Array<TeamMemberMetrics>;
    public readonly Conditions : Array<[string, string]>;

    constructor(leadTime: Array<number>, cycleTime: Array<number>, teamMembers: Array<TeamMemberMetrics>, conditions:Array<[string, string]>) {
        this.LeadTime = leadTime;
        this.CycleTime = cycleTime;
        this.TeamMembers = teamMembers;
        this.Conditions = conditions;
    }
}