import { Statistics } from "../Simulation/Statistics";
import { StatisticsDescriptive } from "../Simulation/StatisticsDescriptive";
import { TeamMemberMetrics } from "../Simulation/TeamMemberMetrics";
import { Data } from "./Data";

export class Result {
    public readonly LeadTime : StatisticsDescriptive;
    public readonly CycleTime : StatisticsDescriptive;
    public readonly WorkSizeOriginalMean : number;
    public readonly WorkSizeActualMean : number;
    public readonly TeamMembers : Array<TeamMemberMetrics>;
    public readonly TeamMembersIdleFrequency : number; 
    public readonly Conditions : Array<[string, string]>;
    public readonly Constraint : string;

    constructor(data : Data) {
        this.LeadTime = Statistics.Describe(data.LeadTime);
        this.CycleTime = Statistics.Describe(data.CycleTime);
        this.WorkSizeOriginalMean = data.WorkSizeOriginalMean;
        this.WorkSizeActualMean = data.WorkSizeActualMean;
        this.TeamMembers = data.TeamMembers.sort((a,b) => a.TimeIdle.Median - b.TimeIdle.Median);
        this.Constraint = this.TeamMembers[0].Name;
        this.TeamMembersIdleFrequency = Statistics.FrequencyTestBin(data.TeamMembers.map((teamMember) => teamMember.TimeIdle.Sum)); 
        this.Conditions = data.Conditions;
    }
}