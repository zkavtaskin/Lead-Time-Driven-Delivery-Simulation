import { Backlog } from "../Simulation/Backlog";
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";
import { Histogram } from "./Histogram";

export class TestResult {
    public readonly Metrics : Histogram;
    public readonly Conditions : Array<[string, string]>;

    constructor(metrics:Histogram, conditions:Array<[string, string]>) {
        this.Metrics = metrics;
        this.Conditions = conditions;
    }
}