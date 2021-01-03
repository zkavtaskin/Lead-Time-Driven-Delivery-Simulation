import { TestResult} from "./TestResult"
import { ExperimentResult} from "./ExperimentResult"
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";
import * as simplestats from 'simple-statistics'

export abstract class Experiment {
    public abstract readonly Name : string;
    public abstract readonly Description : string;
    protected abstract assumptions() : Array<[string, boolean]>
    protected abstract controlGroup() : TestResult;
    protected abstract experimentGroup() : TestResult;

    public Run() : ExperimentResult {
        const assumptions = this.assumptions();
        const controlAResult = this.controlGroup();
        const controlBResult = this.controlGroup();
        const experimentResult = this.experimentGroup();
        
        const pValue = simplestats.permutationTest(controlAResult.Metrics.LeadTimeData, experimentResult.Metrics.LeadTimeData);
        const nullHypothesis = pValue > 0.05;
        
        return new ExperimentResult(assumptions, controlAResult.Metrics.LeadTime, experimentResult.Metrics.LeadTime, nullHypothesis, experimentResult.Conditions);
    }
}