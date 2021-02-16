import { Statistics } from "../Simulation/Statistics";
import { Test } from "./Test"
import { TeamSimulation } from "../Simulation/TeamSimulation"
import { Data } from "./Data";
import { BacklogDecoder } from "../Optimisation/Discrete/BacklogDecoder"
import { Backlog } from "../Optimisation/Discrete/Backlog"
import { RandomForest } from "../Optimisation/Discrete/RandomForest"
import { DiscreteOptimiser } from "../Optimisation/Discrete/DiscreteOptimiser"
import { DiscreteDecoder } from "../Optimisation/Discrete/DiscreteDecoder";
import { Story } from "../Simulation/Story";
import { BacklogConfig } from "../Simulation/BacklogConfig";

export abstract class SoftwareTest extends Test  {

    protected readonly effortPerTick = 1/4;
    protected readonly backlogConfig = new BacklogConfig(10, 1/4, 1/10, 1, 10, () => 
    Statistics.Choice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, [0.25, 0.25, 0.05, 0.05, 0.10, 0.05, 0.10, 0.05, 0.05, 0.05])[0]);

    protected controlGroup(): Data {
        const samples = this.Sample(() => {
            const teamSimulation = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick, null);
            return teamSimulation.Run();
        });

        return new Data(samples[0], samples[1], null);
    }

    protected assumptions(control : Data) : Array<[string, boolean]> {
        const teamSimulationTest = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick);
        const metricsTest = teamSimulationTest.Run().Backlog;

        const LeadNotNormal = () : [string, boolean] => [
            "Lead Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(metricsTest.LeadTime.Kurtosis, metricsTest.LeadTime.Skew)
        ];

        const CycleNotNormal = () : [string, boolean] => [
            "Cycle Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(metricsTest.CycleTime.Kurtosis, metricsTest.CycleTime.Skew)
        ];

        const LeadTimeControlNullHypo = () : [string, boolean] => [
            "Two random Lead Time control experiments come from same distribution (Null-Hypothesis is true)",
            Statistics.MoodsMedianTest(metricsTest.LeadTimeData, control.LeadTime)
        ];

        return [LeadNotNormal(), CycleNotNormal(), LeadTimeControlNullHypo()];
    }

    protected experimentGroup(): Data {
        const decoder = new BacklogDecoder(this.teamConfig) as DiscreteDecoder;
        const optimiser = new Backlog(this.teamConfig, this.backlogConfig, this.effortPerTick, decoder) as DiscreteOptimiser;
        const randomForest = new RandomForest(optimiser, decoder);
        const result = randomForest.Search(30);

        const samples = this.Sample(() => {
            const teamSimulation = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick, decoder.Decode(result.Encoding) as ((a : Story, b : Story) => number));
            return teamSimulation.Run();
        });

        return new Data(samples[0], samples[1], [["Sort",result.EncodingDecoded.join(", ")]]);
    }


}