import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { DiscreteSearchResult } from "./DiscreteSearchResult"
import { DiscreteOptimiser } from "./DiscreteOptimiser";
import { Trees } from "./Trees";
import { DiscreteDecoder } from "./DiscreteDecoder";
import { Story } from "../../Simulation/Story";

export class Backlog implements DiscreteOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly backlogDecoder : DiscreteDecoder;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5, backlogDecoder: DiscreteDecoder) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.backlogDecoder = backlogDecoder;
    }

    Search() : DiscreteSearchResult {
        let minTime = Infinity, minUniformity = Infinity,  bestCombination = null;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize, null, true);
        let objective_function = (combination) => {
            teamSimulation.Reset(this.backlogDecoder.Decode(combination) as ((a : Story, b : Story) => number));
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
        Trees.BranchAndBound(this.backlogDecoder.Base, objective_function);
        return new DiscreteSearchResult(minTime, bestCombination, this.backlogDecoder.DecodeReadable(bestCombination));
    }
}