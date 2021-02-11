import { Statistics } from "../Simulation/Statistics";
import { StatisticsDescriptive } from "../Simulation/StatisticsDescriptive";
import { Data } from "./Data";

export class Result {
    public readonly LeadTime : StatisticsDescriptive;
    public readonly CycleTime : StatisticsDescriptive;
    public readonly Conditions : Array<[string, string]>;

    constructor(data : Data) {
        this.LeadTime = Statistics.Describe(data.LeadTime);
        this.CycleTime = Statistics.Describe(data.CycleTime);
        this.Conditions = data.Conditions;
    }
}