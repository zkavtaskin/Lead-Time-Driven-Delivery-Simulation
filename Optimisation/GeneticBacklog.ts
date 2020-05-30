import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { TeamSimulation } from "../Simulation/TeamSimulation";
import { Result } from "./Result"
import * as genetic from "charles.darwin"
import { GeneticDecoderBacklog } from "./GeneticDecoderBacklog";

export class GeneticBacklog {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly decoder : GeneticDecoderBacklog;
    private randomGeneCounter : number = 0;
    private randomGene : Array<number> = null;
    private readonly numberOfSamples = 3;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.decoder = new GeneticDecoderBacklog(teamConfig);
    }

    *Search() : IterableIterator<Result> {
        const geneticPool = new genetic.Darwin<number>({
            population_size: this.decoder.Population,
            chromosome_length: this.decoder.ChromoLen,
            rand_gene: (() => {
                return this.getRandomGene();
            })
        });

        while(true) {
            for (const genes of geneticPool.getPopulation()) {

                this.backlogConfig.StorySort = this.decoder.Decode(genes.getGenes());

                let sampleMean = 0;
                for(let i = 0; i < this.numberOfSamples; i++) {
                    const teamSimulation = new TeamSimulation(genes.getGenes().join(''), this.teamConfig, this.backlogConfig, this.effortSize);
                    sampleMean += teamSimulation.Run().GetStats().LeadTime.Mean;
                }

                genes.setFitness(-(sampleMean / this.numberOfSamples));
            }

            yield new Result(-geneticPool.getFittest().getFitness(), geneticPool.getFittest().getGenes(), this.decoder.DecodeHuman(geneticPool.getFittest().getGenes()));
            geneticPool.mate();
        }
    }

    private getRandomGene() : number {
        const geneIndex = this.randomGeneCounter % this.decoder.ChromoLen;
        if(geneIndex == 0) {
            this.randomGene = this.decoder.GetRandom();
        }
        this.randomGeneCounter++;
        return this.randomGene[geneIndex];
    }

}