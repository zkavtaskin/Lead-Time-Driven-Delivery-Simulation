import { BacklogConfig } from "../../Simulation/BacklogConfig";
import { TeamConfig } from "../../Simulation/TeamConfig";
import { TeamSimulation } from "../../Simulation/TeamSimulation";
import { Result } from "../Result"
import * as genetic from "charles.darwin"
import { GeneticBacklogDecoder } from "./GeneticBacklogDecoder";
import { BacklogOptimiser } from "../BacklogOptimiser";

export class GeneticBacklog implements BacklogOptimiser {

    private readonly teamConfig : TeamConfig;
    private readonly backlogConfig : BacklogConfig;
    private readonly effortSize : number;
    private readonly decoder : GeneticBacklogDecoder;
    private randomGeneCounter : number = 0;
    private randomGene : Array<number> = null;
    private readonly numberOfSamples = 3;

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig, effortSize : number = 0.5) {
        this.teamConfig = teamConfig;
        this.backlogConfig = backlogConfig;
        this.effortSize = effortSize;
        this.decoder = new GeneticBacklogDecoder(teamConfig);
    }

    Solve() : Result {
        const geneticPool = new genetic.Darwin<number>({
            population_size: this.decoder.Population,
            chromosome_length: this.decoder.ChromoLen,
            rand_gene: (() => {
                return this.getRandomGene();
            })
        });

        let best = Infinity, attempts = 0;
        const teamSimulation = new TeamSimulation(null, this.teamConfig, this.backlogConfig, this.effortSize);
        do {
            for (const genes of geneticPool.getPopulation()) {
                teamSimulation.Reset(this.decoder.Decode(genes.getGenes()));
                const teamSimulationStats = teamSimulation.Run().GetStats();
                genes.setFitness(-teamSimulationStats.LeadTime.Mean);
            }
            geneticPool.mate();
        } while(-geneticPool.getFittest().getFitness() < best || (-geneticPool.getFittest().getFitness() / best < 0.01 && attempts++ < 5));

        return new Result(-geneticPool.getFittest().getFitness(), geneticPool.getFittest().getGenes(), this.decoder.DecodeReadable(geneticPool.getFittest().getGenes()));
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