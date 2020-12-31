import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { TeamSimulation } from "../Simulation/TeamSimulation"
import { Experiment } from "../Experiment/Experiment"
import { TestResult } from "./TestResult"
import { BnBBacklogDecoder } from "../Optimisation/BranchBound/BnBBacklogDecoder"
import { BnBBacklog } from "../Optimisation/BranchBound/BnBBacklog"
import { RandomForest } from "../Optimisation/RandomForest"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser"
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics"
import { Statistics } from "../Simulation/Statistics"

export class ScrumTeamExperiment extends Experiment {

    public readonly Name: string = "Scrum Team";

    public Description: string = `
Simulation of a cross functional "Scrum" team with some supporting "Component" teams. 
Experiment searches for:
    1) Shortest lead time
    2) Follows as close uniform distribution as possible  
    3) Delivers biggest amount of stories (value), this is a given as under the experiment everyone needs to deiver set amount of stories.  
As a starting point experiment will be setup to have a bias towards delivering work right at the end the cycle.
    `;

    private teamConfig = new TeamConfig([
            new MemberConfig("Product Owner", 10/37, 8/10, 10/100),
            new MemberConfig("UX", 10/37, 2/10, 5/100),
            new MemberConfig("Architecture", 5/37, 2/10, 5/100),
            new MemberConfig("Back-End", 37/37, 8/10, 35/100),
            new MemberConfig("Front-End", 37/37, 8/10, 35/100),
            new MemberConfig("Test", 37/37, 10/10, 10/100)], 
        [
            /***
             * Bottom 0 diagonal represents flow downstream dependencies (prerequisite work)
             * top 0 diagonal represents flow "feedback" upstream 
             *  PO  UX   ARCH  BE      FE   TEST <= X-axis is same "mirror" for Y-axis, order is the same as above order
             */
                [0, 1/5, 1/10, 1/5,   1/5, 1/10],
                [1, 0,   1/10,   0,   1/5, 1/10],
                [1, 0,      0, 1/5,  1/10,    0],
                [1, 0,      1,   0,   1/2,  1/2],
                [1, 1,      1,   0,     0,  1/2],
                [0, 0,      0,   1,     1,    0] 
            /*** 
             * With graph provides a depdency map for prerequisite work, meaning the following will happen:
             * If story contains work for product owner then it will have to travel through product owner before 
             * it goes to UX, ARCH, BE, FE and TEST. 
             * If story has no product owner involvement and it has UX involvement, then it FE has to wait for UX to do their bit.
             * When it comes to feedback it travels backward so a tester might give some feedback per 1 story out of 2 to FE and 
             * 1 out of 10 story feedback to PO and UX. 
             */
        ]
    );
    private backlogConfig = new BacklogConfig(200, 1/10, 1/10, 1, 10);
    private effortPerTick = 1;
    
    protected assumptions(): Array<[string, boolean]> {

        const teamSimulationA = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsA = teamSimulationA.Run().GetRuntimeMetrics();
        
        const teamSimulationB = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsB = teamSimulationB.Run().GetRuntimeMetrics();

        const LeadNotNormal = () : [string, boolean] => [
                "Lead Time does NOT follow normal distribution (Nonparametric)",
                !Statistics.IsNormalDistribution(statsA.LeadTime.Kurtosis, statsA.LeadTime.Skew)];

        const CycleNotNormal = () : [string, boolean] => [
            "Cycle Time does NOT follow normal distribution (Nonparametric)",
            !Statistics.IsNormalDistribution(statsA.CycleTime.Kurtosis, statsA.CycleTime.Skew)];

        const LeadTimeControlNullHypo = () : [string, boolean] => [
            "Two random Lead Time control experiments come from same distribution (Null-Hypothesis is true)",
            false];

        return [LeadNotNormal(), CycleNotNormal(), LeadTimeControlNullHypo()];
    }

    protected controlGroup(): TestResult {
        const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        return new TestResult(teamSimulation.Run().GetRuntimeMetrics(), null);
    }

    protected experimentGroup(): TestResult {
        const backlogDecoder = new BnBBacklogDecoder(this.teamConfig);
        const backlogOptimiser = new BnBBacklog(this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder) as BacklogOptimiser;
        const randomForestOptimiser = new RandomForest(backlogOptimiser, backlogDecoder);
        const result = randomForestOptimiser.Search(50);
        const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder.Decode(result.BestEncoding));
        return new TestResult(teamSimulation.Run().GetRuntimeMetrics(), [["Sort",result.BestEncodingDecoded.join(",")]])
    }
}