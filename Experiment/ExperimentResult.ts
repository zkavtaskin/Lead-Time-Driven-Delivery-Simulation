import { Summary } from "../Simulation/BacklogStats";

export class ExperimentResult {
    public readonly ControlStats : Summary;
    public readonly ExperimentStats : Summary;
    public readonly ExperimentConditions : Array<[string, string]>;
    public readonly NullHypothesis : boolean

    constructor(scoreControl: Summary, scoreExperiment:Summary, nullHypothesis:boolean, conditions: Array<[string, string]>) {
        this.ControlStats = scoreControl;
        this.ExperimentStats = scoreExperiment;
        this.NullHypothesis = nullHypothesis;
        this.ExperimentConditions = conditions;
    }
}