import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { Result } from "../Result"
import { BacklogOptimiser } from "../BacklogOptimiser";
import { BnBBacklogDecoder } from "./BnBBacklogDecoder";

export class BnBBacklog implements BacklogOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly decoder : BnBBacklogDecoder;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.decoder = new BnBBacklogDecoder(teamConfig);
    }

    Solve() : Result {
        let best = Infinity;
        let bestPattern = null;
        let rule = (pattern) => {
            const teamSimulation = new TeamSimulation(pattern.join(''), this.teamConfig, this.backlogConfig, this.effortSize, this.decoder.Decode(pattern));
            const teamSimulationStats = teamSimulation.Run().GetStats();
            if(teamSimulationStats.LeadTime.Mean < best) {
                best = teamSimulationStats.LeadTime.Mean;
                bestPattern = pattern;
                return true
            }
            return false
        }
        BnBBacklog.generateCombinations(this.decoder.Size, rule)
        return new Result(best, bestPattern, this.decoder.DecodeReadable(bestPattern));
    }

    static generateCombinations(n:number, rule:(p : Array<number>) => boolean) {
        const bagOrigin:Array<number> = [...Array(n).keys()];
        const root = [[[...bagOrigin], []]];
        const combinations = []
        let bag = null;
        while(bag = root.shift()) {
            for(let i:number = 0; i < bag[0].length; i++) {
                const newBag = [...bag[0]];
                const newPattern = [...bag[1]];
                const k = newBag.splice(i, 1)[0];
                newPattern.push(k);
                if(rule == undefined || rule(newPattern)) {
                    root.push([newBag, newPattern]);
                    combinations.push(newPattern)
                }
            }
        } 
        return combinations;
    }

}