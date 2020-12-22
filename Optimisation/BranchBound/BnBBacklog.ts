import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { Result } from "../Result"
import { BacklogOptimiser } from "../BacklogOptimiser";
import { BnBBacklogDecoder } from "./BnBBacklogDecoder";
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

    Search() : Result {
        let min = Infinity,  bestPattern = null;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize);
        let valuation = (pattern) => {
            teamSimulation.Reset(this.backlogDecoder.Decode(pattern));
            const mean = teamSimulation.Run().GetStats().LeadTime.Mean;
            if(mean < min) {
                min = mean;
                bestPattern = pattern;
            }
            //relax the search, keep searching nodes that are around < 0.05 from the
            //the min
            if(mean/min < 1.05)
                return mean;
                
            return null;
        }
        const results = BnBBacklog.generateCombinations(this.backlogDecoder.Base, valuation);
        return new Result(min, bestPattern, this.backlogDecoder.DecodeReadable(bestPattern));
    }

    static generateCombinations(n:number, valuator:(pattern : Array<number>) => number) {
        const bagOrigin:Array<number> = [...Array(n).keys()];
        const root = [[[...bagOrigin], []]];
        const combinations = [];
        const valuations = [];
        let bag = null;
        let valuation:number;
        while(bag = root.shift()) {
            for(let i:number = 0; i < bag[0].length; i++) {
                const newBag = [...bag[0]];
                const newPattern = [...bag[1]];
                const k = newBag.splice(i, 1)[0];
                newPattern.push(k);
                if(valuator) {
                    if(valuation = valuator(newPattern))
                        valuations.push(valuation);
                    else 
                        continue;
                }
                root.push([newBag, newPattern]);
                combinations.push(newPattern);
            }
        } 
        return [combinations, valuations];
    }

}