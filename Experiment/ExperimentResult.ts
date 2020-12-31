import { StatisticsDescriptive } from "../Simulation/StatisticsDescriptive";

export class ExperimentResult {
    public readonly Assumptions : Array<[string, boolean]>;
    public readonly ControlStats : StatisticsDescriptive;
    public readonly ExperimentStats : StatisticsDescriptive;
    public readonly ExperimentConditions : Array<[string, string]>;
    public readonly NullHypothesis : boolean

    constructor(assumptions:Array<[string, boolean]>, scoreControl: StatisticsDescriptive, scoreExperiment:StatisticsDescriptive, nullHypothesis:boolean, experimentConditions: Array<[string, string]>) {
        this.Assumptions = assumptions;
        this.ControlStats = scoreControl;
        this.ExperimentStats = scoreExperiment;
        this.NullHypothesis = nullHypothesis;
        this.ExperimentConditions = experimentConditions;
    }
}