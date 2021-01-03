import { Backlog } from "../Simulation/Backlog";
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";

export class TestResult {
    public readonly Metrics : BacklogRuntimeMetrics;
    public readonly Conditions : Array<[string, string]>;

    constructor(metrics:BacklogRuntimeMetrics, conditions:Array<[string, string]>) {
        this.Metrics = metrics;
        this.Conditions = conditions;
    }
}