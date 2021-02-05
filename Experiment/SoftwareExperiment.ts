import { Statistics } from "../Simulation/Statistics";
import { Experiment } from "./Experiment"
import { TeamSimulation } from "../Simulation/TeamSimulation"
import * as simplestats from 'simple-statistics'
import { TestResult } from "./TestResult";
import { Histogram } from "./Histogram";
import { BacklogDecoder } from "../Optimisation/Discrete/BacklogDecoder"
import { Backlog } from "../Optimisation/Discrete/Backlog"
import { RandomForest } from "../Optimisation/Discrete/RandomForest"
import { DiscreteOptimiser } from "../Optimisation/Discrete/DiscreteOptimiser"
import { DiscreteDecoder } from "../Optimisation/Discrete/DiscreteDecoder";
import { Story } from "../Simulation/Story";

export abstract class SoftwareExperiment extends Experiment  {

    protected readonly effortPerTick = 1/4;

    protected assumptions() : Array<[string, boolean]> {
        const teamSimulationA = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsA = teamSimulationA.Run().GetRuntimeMetrics();
        
        const teamSimulationB = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsB = teamSimulationB.Run().GetRuntimeMetrics();

        const LeadNotNormal = () : [string, boolean] => [
                "Lead Time does NOT follow normal distribution (Nonparametric)",
                !Statistics.IsNormalDistribution(statsA.LeadTime.Kurtosis, statsA.LeadTime.Skew)
        ];

        const CycleNotNormal = () : [string, boolean] => [
            "Cycle Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(statsA.CycleTime.Kurtosis, statsA.CycleTime.Skew)
        ];

        const LeadTimeControlNullHypo = () : [string, boolean] => [
            "Two random Lead Time control experiments come from same distribution (Null-Hypothesis is true)",
            simplestats.permutationTest(statsA.LeadTimeData, statsB.LeadTimeData) > 0.05
        ];

        return [LeadNotNormal(), CycleNotNormal(), LeadTimeControlNullHypo()];
    }

    protected controlGroup(): TestResult {
        const histogram = this.Test(() => {
            const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick, null);
            return teamSimulation.Run().GetRuntimeMetrics()
        });

        return new TestResult(new Histogram(histogram[0], histogram[1]), null);
    }

    protected experimentGroup(): TestResult {
        const decoder = new BacklogDecoder(this.teamConfig) as DiscreteDecoder;
        const optimiser = new Backlog(this.teamConfig, this.backlogConfig, this.effortPerTick, decoder) as DiscreteOptimiser;
        const randomForest = new RandomForest(optimiser, decoder);
        const result = randomForest.Search(30);


        const histogram = this.Test(() => {
            const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick, decoder.Decode(result.Encoding) as ((a : Story, b : Story) => number));
            return teamSimulation.Run().GetRuntimeMetrics()
        });

        return new TestResult(new Histogram(histogram[0], histogram[1]), [["Sort",result.EncodingDecoded.join(", ")]]);
    }


}