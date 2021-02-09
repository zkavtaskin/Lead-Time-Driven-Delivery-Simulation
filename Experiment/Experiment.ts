import { TestResult} from "./TestResult"
import { ExperimentResult} from "./ExperimentResult"
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";
import * as simplestats from 'simple-statistics'
import { Statistics } from "../Simulation/Statistics";
import { TeamConfig } from "../Simulation/TeamConfig";
import { BacklogConfig } from "../Simulation/BacklogConfig";

export abstract class Experiment {

    public abstract readonly Name : string;
    public abstract readonly Description : string;

    protected abstract readonly teamConfig : TeamConfig;
    protected abstract readonly backlogConfig : BacklogConfig;
    protected abstract readonly effortPerTick: number;

    protected abstract assumptions() : Array<[string, boolean]>
    protected abstract controlGroup() : TestResult;
    protected abstract experimentGroup() : TestResult;

    public Run() : ExperimentResult {
        const assumptions = this.assumptions();
        const controlAResult = this.controlGroup();
        const controlBResult = this.controlGroup();
        const experimentResult = this.experimentGroup();
        
        //TODO: to fix this
        //const pValue = simplestats.permutationTest(controlAResult.Metrics.LeadTimeData, experimentResult.Metrics.LeadTimeData);
        //const nullHypothesis = pValue > 0.05;
        
        return new ExperimentResult(assumptions, controlAResult.Metrics, experimentResult.Metrics, null, experimentResult.Conditions);
    }

    protected Sample(experiment : () => BacklogRuntimeMetrics, samples : number = 15) : [Array<number>, number] {
        const histograms = new Array<Array<number>>();
        let binsRange = 0;
        for(let i = 0; i < samples; i++) {
            const backlogRuntimeMetrics = experiment();
            histograms.push(backlogRuntimeMetrics.LeadTime.Histogram);
            binsRange = backlogRuntimeMetrics.LeadTime.HistogramRange;
        }
        return [Statistics.HistogramSum(histograms), binsRange];
    }
}