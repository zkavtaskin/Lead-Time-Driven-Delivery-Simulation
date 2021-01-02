import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { SearchResult } from "../SearchResult"
import { BacklogOptimiser } from "../BacklogOptimiser";
import { BacklogDecoder } from "../BacklogDecoder";
import { Trees } from "../../Optimisation/Trees";

export class BnBBacklog implements BacklogOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly backlogDecoder : BacklogDecoder;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5, backlogDecoder: BacklogDecoder) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.backlogDecoder = backlogDecoder;
    }

    Search() : SearchResult {
        let minTime = Infinity, minUniformity = Infinity,  bestCombination = null;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize, null, true);
        let optimisation_function = (combination) => {
            teamSimulation.Reset(this.backlogDecoder.Decode(combination));
            const leadTimeStatistics = teamSimulation.Run().GetRuntimeMetrics().LeadTime;
            const maxTime = leadTimeStatistics.Max;
            const maxUniformity = leadTimeStatistics.Frequency;
            if(maxTime < minTime && maxUniformity < minUniformity) {
                minTime = maxTime;
                minUniformity = maxUniformity;
                bestCombination = combination;
                return true;
            }
            return false;
        }
        Trees.BranchAndBound(this.backlogDecoder.Base, optimisation_function);
        return new SearchResult(minTime, bestCombination, this.backlogDecoder.DecodeReadable(bestCombination));
    }
}