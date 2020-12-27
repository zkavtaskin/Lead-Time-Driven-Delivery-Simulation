import { TestResult} from "./TestResult"
import { ExperimentResult} from "./ExperimentResult"
import { BacklogStats } from "../Simulation/BacklogStats";

export abstract class Experiment {
    protected abstract assumptions() : Array<[string, boolean]>
    protected abstract controlGroup() : TestResult;
    protected abstract experimentGroup() : TestResult;
    protected abstract name : string;

    public Run() : ExperimentResult {
        const assumptions = this.assumptions();
        const controlAResult = this.controlGroup();
        const controlBResult = this.controlGroup();
        const experimentResult = this.experimentGroup();
        
        const nullHypControlGroups = BacklogStats.TwoSampleTest(controlAResult.Score.LeadTime, controlBResult.Score.LeadTime);
        if(nullHypControlGroups != null) {
            throw new Error(`${this.name} experiment is not stable, same control groups have different means.`);
        }

        const nullHypControlvsExperiment = BacklogStats.TwoSampleTest(controlAResult.Score.LeadTime, experimentResult.Score.LeadTime);
        
        return new ExperimentResult(assumptions, controlAResult.Score.LeadTime, experimentResult.Score.LeadTime, nullHypControlvsExperiment, experimentResult.Conditions);
    }
}