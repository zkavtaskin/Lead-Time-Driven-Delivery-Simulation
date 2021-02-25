import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { DiscreteSearchResult } from "./DiscreteSearchResult"
import { DiscreteOptimiser } from "./DiscreteOptimiser";
import { Trees } from "./Trees";
import { DiscreteDecoder } from "./DiscreteDecoder";
import { Story } from "../../Simulation/Story";

export class BacklogOptimiser implements DiscreteOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly backlogDecoder : DiscreteDecoder;
    private readonly map = new Map<string, [string, string]>();

    private static ObjectiveLeadTimeMedian = "LeadTimeMedian";
    private static ObjectiveLeadTimeMax = "LeadTimeMax";
    private static ObjectiveLeadTimeFrequency = "LeadTimeFrequency";

    get ObjectiveFunctions() : Array<string> {
        return [BacklogOptimiser.ObjectiveLeadTimeMedian, BacklogOptimiser.ObjectiveLeadTimeMax, BacklogOptimiser.ObjectiveLeadTimeFrequency];
    }

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5, backlogDecoder: DiscreteDecoder) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.backlogDecoder = backlogDecoder;

        this.map.set(BacklogOptimiser.ObjectiveLeadTimeMedian, ["LeadTime", "Median"]);
        this.map.set(BacklogOptimiser.ObjectiveLeadTimeMax, ["LeadTime", "Max"]);
        this.map.set(BacklogOptimiser.ObjectiveLeadTimeFrequency, ["LeadTime", "Frequency"]);
    }

    Search(objectiveFunctionName:string) : DiscreteSearchResult {
        let min = Infinity, minCombination = null, _class = this.map.get(objectiveFunctionName)[0], property = this.map.get(objectiveFunctionName)[1];
        const teamSimulation = new TeamSimulation(this.teamConfig, this.backlogConfig, this.effortSize, null, true);
        let objectiveFunction = (combination) => {
            teamSimulation.Reset(this.backlogDecoder.Decode(combination) as ((a : Story, b : Story) => number));
            const metrics = teamSimulation.Run().Backlog[_class];
            const value = metrics[property];
            if(value < min) {
                min = value;
                minCombination = combination;
                return true;
            }
            return false;
        }
        Trees.BranchAndBound(this.backlogDecoder.Base, objectiveFunction);
        return new DiscreteSearchResult(min, minCombination, this.backlogDecoder.DecodeReadable(minCombination));
    }

}