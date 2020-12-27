import { Summary } from "../Simulation/BacklogStats";

export class ExperimentResult {
    public readonly Assumptions : Array<[string, boolean]>;
    public readonly ControlStats : Summary;
    public readonly ExperimentStats : Summary;
    public readonly ExperimentConditions : Array<[string, string]>;
    public readonly NullHypothesis : boolean

    constructor(assumptions:Array<[string, boolean]>, scoreControl: Summary, scoreExperiment:Summary, nullHypothesis:boolean, experimentConditions: Array<[string, string]>) {
        this.Assumptions = assumptions;
        this.ControlStats = scoreControl;
        this.ExperimentStats = scoreExperiment;
        this.NullHypothesis = nullHypothesis;
        this.ExperimentConditions = experimentConditions;
    }
}