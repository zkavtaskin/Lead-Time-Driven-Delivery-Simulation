import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { SearchResult } from "../SearchResult"
import { BacklogOptimiser } from "../BacklogOptimiser";
import { BacklogDecoder } from "../BacklogDecoder";

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
        let minTime = Infinity, minUniformity = Infinity,  bestPattern = null;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize);
        let valuation = (pattern) => {
            teamSimulation.Reset(this.backlogDecoder.Decode(pattern));
            const maxTime = teamSimulation.Run().GetStats().LeadTime.Max;
            const maxUniformity = teamSimulation.Run().GetStats().LeadTimeUniformity;
            if(maxTime < minTime && maxUniformity < minUniformity) {
                minTime = maxTime;
                minUniformity = maxUniformity;
                bestPattern = pattern;
                return true;
            }
            return false;
        }
        const results = BnBBacklog.generateCombinations(this.backlogDecoder.Base, valuation);
        return new SearchResult(minTime, bestPattern, this.backlogDecoder.DecodeReadable(bestPattern));
    }

    static generateCombinations(n:number, boundary:(pattern : Array<number>) => boolean) {
        const bagOrigin:Array<number> = [...Array(n).keys()];
        const root = [[[...bagOrigin], []]];
        const combinations = [];
        let bag = null;
        while(bag = root.shift()) {
            for(let i:number = 0; i < bag[0].length; i++) {
                const newBag = [...bag[0]];
                const newPattern = [...bag[1]];
                const k = newBag.splice(i, 1)[0];
                newPattern.push(k);
                if(boundary && !boundary(newPattern)) {
                    continue;
                }
                root.push([newBag, newPattern]);
                combinations.push(newPattern);
            }
        } 
        return combinations;
    }

}