import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { Result } from "../Result"
import { BacklogOptimiser } from "../BacklogOptimiser";
import { BnBDecoderBacklog } from "./BnBDecoderBacklog";

export class BnBBacklog implements BacklogOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly decoder : BnBDecoderBacklog;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.decoder = new BnBDecoderBacklog(teamConfig);
    }

    Solve() : Result {
        const depth = this.decoder.Size;
        let patterns = []
        for(let i = 0; i < depth; i++) {
            //TODO
        }
        

        return null;
    }

    private factorial(n:number) {
        return n ? n * this.factorial(n - 1) : 1;
    }

}