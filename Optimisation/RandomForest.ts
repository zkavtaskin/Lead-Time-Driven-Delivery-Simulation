import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { TeamSimulation } from "../Simulation/TeamSimulation";
import { Result } from "..//Optimisation/Result"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser";

export class RandomForest {
    Solve(optimiser:BacklogOptimiser, sample:number = 50) : Result {
        //find the most common paths
        for(let i=0; i < sample; i++) {
        }
        return null;
    }

}