import { Data} from "./Data"
import { TestResult} from "./TestResult"
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";
import { Statistics } from "../Simulation/Statistics";
import { TeamConfig } from "../Simulation/TeamConfig";
import { BacklogConfig } from "../Simulation/BacklogConfig";
import { Result } from "./Result";

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
        return new TestResult(assumptions, new Result(control), new Result(experiment), nullHypothesis);
    }

    protected Sample(experiment : () => BacklogRuntimeMetrics, nSamples : number = 30) : [Array<number>, Array<number>] {
        let leadTimeSamples = new Array<number>(),
              cycleTimeSamples = new Array<number>();
        for(let i = 0; i < nSamples; i++) {
            const backlogRuntimeMetrics = experiment();
            leadTimeSamples = leadTimeSamples.concat(backlogRuntimeMetrics.LeadTimeData);
            cycleTimeSamples = cycleTimeSamples.concat(backlogRuntimeMetrics.CycleTimeData);
        }
        return [leadTimeSamples, cycleTimeSamples];
    }
}