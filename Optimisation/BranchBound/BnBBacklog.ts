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
        let best = Infinity, bestPattern = null;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize);
        let boundary = (pattern) => {
            const teamSimulationStats = teamSimulation.Recycle(this.decoder.Decode(pattern)).Run().GetStats();
            if(teamSimulationStats.LeadTime.Mean < best) {
                best = teamSimulationStats.LeadTime.Mean;
                bestPattern = pattern;
                return true
            }
            return false
        }
        BnBBacklog.generateCombinations(this.decoder.Size, boundary)
        return new Result(best, bestPattern, this.decoder.DecodeReadable(bestPattern));
    }

    static generateCombinations(n:number, boundary:(p : Array<number>) => boolean) {
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
                if(boundary == undefined || boundary(newPattern)) {
                    root.push([newBag, newPattern]);
                    combinations.push(newPattern)
                }
            }
        } 
        return combinations;
    }

}