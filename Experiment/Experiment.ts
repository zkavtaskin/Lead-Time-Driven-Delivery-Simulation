import { TestResult} from "./TestResult"
import { ExperimentResult} from "./ExperimentResult"
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";

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
        
        //TODO: need to implement. 
        const nullHypControlvsExperiment = null;
        
        return new ExperimentResult(assumptions, controlAResult.Score.LeadTime, experimentResult.Score.LeadTime, nullHypControlvsExperiment, experimentResult.Conditions);
    }
}