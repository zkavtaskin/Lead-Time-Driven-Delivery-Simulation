import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { TeamSimulation } from "../Simulation/TeamSimulation";
import { Result } from "./Result"
import * as genetic from "charles.darwin"
import { GeneticEncoderBacklog } from "./GeneticEncoderBacklog";

export class Genetic {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly encoder : GeneticEncoderBacklog;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.encoder = new GeneticEncoderBacklog(teamConfig, backlogConfig);
    }

    *Search() : IterableIterator<Result> {

        const geneticPool = new genetic.Darwin<number>({
            population_size: this.encoder.Population,
            chromosome_length: this.encoder.ChromosomeLength,
            rand_gene: (() => {
                return null; //this.encoder.GetRandom();
            })
        });

        while(true) {

            for (const genes of geneticPool.getPopulation()) {
                this.backlogConfig.StorySort = this.encoder.Decode(genes.getGenes());
                const teamSimulation = new TeamSimulation("*", this.teamConfig, this.backlogConfig, this.effortSize);
                const stats = teamSimulation.Run().GetStats();
                genes.setFitness(stats.LeadTime.Mean);
            }

            yield new Result(geneticPool.getFittest().getFitness(), geneticPool.getFittest().getGenes(), geneticPool.getAverageFitness());
            geneticPool.mate();
        }
        

    }

}