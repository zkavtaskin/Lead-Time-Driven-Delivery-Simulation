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
import { BacklogStats } from "../Simulation/BacklogStats"

export class ScrumTeamExperiment extends Experiment {

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
    private backlogConfig = new BacklogConfig(100, 1/10, 1/10, 1, 10);
    private effortPerTick = 1;
    protected name: string = "ScrumTeam";
    
    protected assumptions(): Array<[string, boolean]> {

        const teamSimulationA = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsA = teamSimulationA.Run().GetStats();
        
        const teamSimulationB = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        const statsB = teamSimulationB.Run().GetStats();

        const LeadNotNormal = () : [string, boolean] => [
                "LeadTime does NOT follow normal distribution",
                !BacklogStats.IsNormalDistribution(statsA.LeadTime.Kurtosis, statsA.LeadTime.Skew)];

        const CycleNotNormal = () : [string, boolean] => [
            "CycleTime does NOT follow normal distribution",
            !BacklogStats.IsNormalDistribution(statsA.CycleTime.Kurtosis, statsA.CycleTime.Skew)];

        const grtLeadGrtCycle = () : [string, boolean] => {
            const aGrtThenb = statsA.LeadTime.Median > statsB.LeadTime.Median && statsA.CycleTime.Median > statsB.CycleTime.Median;
            const bGrtThena = statsA.LeadTime.Median < statsB.LeadTime.Median && statsA.CycleTime.Median < statsB.CycleTime.Median;
            return [
                "LeadTimeA > LeadTimeB then CycleTimeA > CycleTimeB",
                aGrtThenb || bGrtThena
            ];
        }

        return [LeadNotNormal(), CycleNotNormal(), grtLeadGrtCycle()];
    }

    protected controlGroup(): TestResult {
        const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick);
        return new TestResult(teamSimulation.Run().GetStats(), null);
    }

    protected experimentGroup(): TestResult {
        const backlogDecoder = new BnBBacklogDecoder(this.teamConfig);
        const backlogOptimiser = new BnBBacklog(this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder) as BacklogOptimiser;
        const randomForestOptimiser = new RandomForest(backlogOptimiser, backlogDecoder);
        const result = randomForestOptimiser.Search(30);
        const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortPerTick, backlogDecoder.Decode(result.BestEncoding));
        return new TestResult(teamSimulation.Run().GetStats(), [["Sort",result.BestEncodingDecoded.join(",")]])
    }
}