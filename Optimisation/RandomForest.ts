import { SearchResult } from "./SearchResult"
import { BacklogDecoder } from "./BacklogDecoder"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser";
import { Trees } from "../Optimisation/Trees";
import { TestResult } from "../Experiment/TestResult";

export class RandomForest {

    private readonly optimiser : BacklogOptimiser;
    private readonly decoder : BacklogDecoder;

    constructor(optimiser:BacklogOptimiser, decoder:BacklogDecoder) {
        this.optimiser = optimiser;
        this.decoder = decoder;
    }

    Search(sample:number = 50) : SearchResult {
        //grow the forest
        const results = new Array<SearchResult>();
        for(let i=0; i < sample; i++) {
            results.push(this.optimiser.Search());
        }

        //reduce the forest by growing split tree with branches  
        const tree = new Array<number>(this.decoder.Base);
        for(let i=0; i < results.length; i++) {
            Trees.BranchCounter(results[i].BestEncoding, tree, this.decoder.Base);
        }

        //get the majority vote
        const maxPattern = Trees.BranchCounterMax(tree, this.decoder.Base);

        return new SearchResult(null, maxPattern, this.decoder.DecodeReadable(maxPattern));
    }

}