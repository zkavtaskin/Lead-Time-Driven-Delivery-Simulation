import { DiscreteSearchResult } from "./DiscreteSearchResult"
import { BacklogDecoder } from "../Discrete/BacklogDecoder"
import { DiscreteOptimiser } from "./DiscreteOptimiser";
import { Trees } from "./Trees";
import { DiscreteDecoder } from "./DiscreteDecoder";

export class RandomForest {

    private readonly optimiser : DiscreteOptimiser;
    private readonly decoder : DiscreteDecoder;

    constructor(optimiser:DiscreteOptimiser, decoder:DiscreteDecoder) {
        this.optimiser = optimiser;
        this.decoder = decoder;
    }

    Search(sample:number = 50) : DiscreteSearchResult {
        //grow the forest
        const results = new Array<DiscreteSearchResult>();
        for(let i=0; i < sample; i++) {
            const k = Math.floor(Math.random() * this.optimiser.ObjectiveFunctions.length)
            results.push(this.optimiser.Search(this.optimiser.ObjectiveFunctions[k]));
        }

        //reduce the forest by growing split tree with weighted branches  
        const tree = new Array<number>(this.decoder.Base);
        for(let i=0; i < results.length; i++) {
            Trees.BranchCounter(results[i].Encoding, tree, this.decoder.Base);
        }

        //get the majority vote
        const maxPattern = Trees.BranchCounterMax(tree, this.decoder.Base);

        return new DiscreteSearchResult(null, maxPattern, this.decoder.DecodeReadable(maxPattern));
    }

}