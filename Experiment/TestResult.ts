import { Backlog } from "../Simulation/Backlog";
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";

export class TestResult {
    public readonly Score : BacklogRuntimeMetrics;
    public readonly Conditions : Array<[string, string]>;

    constructor(score:BacklogRuntimeMetrics, conditions:Array<[string, string]>) {
        this.Score = score;
        this.Conditions = conditions;
    }
}