import { Backlog } from "../Simulation/Backlog";
import { BacklogStats, Summary } from "../Simulation/BacklogStats";

export class TestResult {
    public readonly Score : BacklogStats;
    public readonly Conditions : Array<[string, string]>;

    constructor(score:BacklogStats, conditions:Array<[string, string]>) {
        this.Score = score;
        this.Conditions = conditions;
    }
}