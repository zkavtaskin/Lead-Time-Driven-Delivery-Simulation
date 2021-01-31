import { Histogram } from "./Histogram";

export class ExperimentResult {
    public readonly Assumptions : Array<[string, boolean]>;
    public readonly Control : Histogram;
    public readonly Experiment : Histogram;
    public readonly ExperimentConditions : Array<[string, string]>;
    public readonly NullHypothesis : boolean

    constructor(assumptions:Array<[string, boolean]>, control: Histogram, experiment:Histogram, nullHypothesis:boolean, experimentConditions: Array<[string, string]>) {
        this.Assumptions = assumptions;
        this.Control = control;
        this.Experiment = experiment;
        this.NullHypothesis = nullHypothesis;
        this.ExperimentConditions = experimentConditions;
    }
}