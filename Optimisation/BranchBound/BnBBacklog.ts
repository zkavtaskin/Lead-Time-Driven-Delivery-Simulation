import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
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
        const bag:Array<number> = new Array(this.decoder.Size);
        return null;
    }

    static generateCombinations(n:number) {
        const bagOrigin:Array<number> = [...Array(n).keys()];
        const root = [[[...bagOrigin], []]];
        const combinations = []
        let bag = null;
        while(bag = root.pop()) {
            for(let i:number = 0; i < bag[0].length; i++) {
                const newBag = [...bag[0]];
                const newPattern = [...bag[1]];
                const k = newBag.splice(i, 1)[0];
                newPattern.push(k);
                root.push([newBag, newPattern]);
                combinations.push(newPattern)
            }
        } 
        return combinations;
    }

}