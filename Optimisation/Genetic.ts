import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { TeamSimulation } from "../Simulation/TeamSimulation";
import { Result } from "./Result"
import * as genetic from "charles.darwin"

export class Genetic {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
    }

    *Search() : IterableIterator<Result> {

        //4 fields in the story + number of tasks in the story
        const chromoLen = 4 + this.teamConfig.Members.length;

        const geneticPool = new genetic.Darwin<number>({
            population_size: chromoLen * 100,
            chromosome_length: chromoLen,
            rand_gene: (() => {
                return null;
                //return random gene TODO
            })
        });

        while(true) {

            for (const genes of geneticPool.getPopulation()) {
                const encoded = genes.getGenes();
                //TODO
                const decodedSort = null;
                //this.backlogConfig.StorySort = 
                const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortSize);
                const stats = teamSimulation.Run().GetStats();
                genes.setFitness(stats.LeadTime.Mean);
            }

            yield new Result(geneticPool.getFittest().getFitness(), geneticPool.getFittest().getGenes(), geneticPool.getAverageFitness());

            geneticPool.mate();
        }
        

    }

}