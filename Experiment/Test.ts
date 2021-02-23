import { Data} from "./Data"
import { TestResult} from "./TestResult"
import { Statistics } from "../Simulation/Statistics";
import { TeamConfig } from "../Simulation/TeamConfig";
import { BacklogConfig } from "../Simulation/BacklogConfig";
import { Result } from "./Result";
import { TeamMetrics } from "../Simulation/TeamMetrics";
import { TeamMemberMetrics } from "../Simulation/TeamMemberMetrics";

export abstract class Test {

    public abstract readonly Name : string;
    public abstract readonly Description : string;

    protected abstract readonly teamConfig : TeamConfig;
    protected abstract readonly backlogConfig : BacklogConfig;
    protected abstract readonly effortPerTick: number;

    protected abstract assumptions(control : Data) : Array<[string, boolean]>
    protected abstract controlGroup() : Data;
    protected abstract experimentGroup() : Data;

    public Run() : TestResult {
        const control = this.controlGroup();
        const assumptions = this.assumptions(control);
        const experiment = this.experimentGroup();

        const nullHypothesis = Statistics.MoodsMedianTest(control.LeadTime, experiment.LeadTime);
        return new TestResult(assumptions, new Result(control), new Result(experiment), nullHypothesis, this.effortPerTick);
    }

    protected Sample(experiment : () => TeamMetrics, nSamples : number = 30) : Data {
        const data = new Data();
        for(let i = 0; i < nSamples; i++) {
            data.AddMetrics(experiment());
        }
        return data;
    }
}