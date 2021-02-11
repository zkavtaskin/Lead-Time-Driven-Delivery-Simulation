import { StatisticsDescriptive } from "../Simulation/StatisticsDescriptive";
import { Result } from "./Result";

export class TestResult {
    public readonly Assumptions : Array<[string, boolean]>;
    public readonly Control : Result;
    public readonly Experiment : Result;
    public readonly NullHypothesis : boolean

    constructor(assumptions:Array<[string, boolean]>, control: Result, experiment:Result, nullHypothesis:boolean) {
        this.Assumptions = assumptions;
        this.Control = control;
        this.Experiment = experiment;
        this.NullHypothesis = nullHypothesis;
    }
}