import { Statistics } from "../Simulation/Statistics";
import { Test } from "./Test"
import { TeamSimulation } from "../Simulation/TeamSimulation"
import { Data } from "./Data";
import { MemberCapacityOptimiser } from "../Optimisation/Continuous/MemberCapacityOptimiser"
import { BacklogDecoder } from "../Optimisation/Discrete/BacklogDecoder"
import { BacklogOptimiser } from "../Optimisation/Discrete/BacklogOptimiser"
import { RandomForest } from "../Optimisation/Discrete/RandomForest"
import { DiscreteOptimiser } from "../Optimisation/Discrete/DiscreteOptimiser"
import { DiscreteDecoder } from "../Optimisation/Discrete/DiscreteDecoder";
import { Story } from "../Simulation/Story";
import { BacklogConfig } from "../Simulation/BacklogConfig";

export abstract class SoftwareTest extends Test  {

    protected readonly effortPerTick = 1/4;
    protected readonly backlogConfig = new BacklogConfig(10, 1/5, 1/10, 1, 10, () => 
    Statistics.Choice([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7], 1, [0.25, 0.25, 0.05, 0.05, 0.10, 0.05, 0.10, 0.05, 0.05, 0.05])[0]);

    protected controlGroup(): Data {
        return this.Sample(() => {
            const teamSimulation = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick, null);
            return teamSimulation.Run();
        });
    }

    protected assumptions(control : Data) : Array<[string, boolean]> {
        const teamSimulationTest = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick);
        const teamMetrics = teamSimulationTest.Run();

        const LeadNotNormal = () : [string, boolean] => [
            "Lead Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(teamMetrics.Backlog.LeadTime.Kurtosis, teamMetrics.Backlog.LeadTime.Skew)
        ];

        const CycleNotNormal = () : [string, boolean] => [
            "Cycle Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(teamMetrics.Backlog.CycleTime.Kurtosis, teamMetrics.Backlog.CycleTime.Skew)
        ];

        const LeadTimeControlNullHypo = () : [string, boolean] => [
            "Two random Lead Time control experiments come from same distribution (Null-Hypothesis is true)",
            Statistics.MoodsMedianTest(teamMetrics.Backlog.LeadTimeData, control.LeadTime)
        ];

        const IdleNotNormal = () : [string, boolean] => [
            "Team member idle does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(control.TeamMembers[0].TimeIdle.Kurtosis, control.TeamMembers[0].TimeIdle.Skew)
        ];

        return [LeadNotNormal(), CycleNotNormal(), LeadTimeControlNullHypo(), IdleNotNormal()];
    }

    protected experimentGroup(): Data {
        const backlogDecoder = new BacklogDecoder(this.teamConfig) as DiscreteDecoder;
        const backlogOptimiser = new BacklogOptimiser(this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder) as DiscreteOptimiser;
        const randomForest = new RandomForest(backlogOptimiser, backlogDecoder);
        const discreteResult = randomForest.Search(30);

        /*
        const memberCapacityOptimiser = new MemberCapacityOptimiser(this.teamConfig, this.backlogConfig, this.effortPerTick);
        const continuousResult = memberCapacityOptimiser.Optimise();
        const teamConfigOptimised = this.teamConfig.ChangeMembersCapacity(continuousResult.x);
        */

        const data = this.Sample(() => {
            const teamSimulation = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder.Decode(discreteResult.Encoding) as ((a : Story, b : Story) => number));
            return teamSimulation.Run();
        });
        data.AddCondition([["Sort",discreteResult.EncodingDecoded.join(", ")]]);

        return data;
    }


}