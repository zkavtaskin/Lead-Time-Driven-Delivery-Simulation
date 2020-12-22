import { SearchResult } from "./SearchResult"
import { BacklogDecoder } from "./BacklogDecoder"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser";

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

        //reduce the forest by growing split tree
        const tree = new Array<number>(this.decoder.Base);
        for(let i=0; i < results.length; i++) {
            this.indexedSparseTree(results[i].BestEncoding, 0, tree, this.decoder.Base);
        }

        //traverse the tree to find the majority vote
        let branch = tree, maxPattern = Array<number>();
        while(true) {
            let max = 0, maxIndex = null;
            for(let i=0; i < this.decoder.Base; i++) {
                if(branch[i] && max < branch[i][1] && 3 <= branch[i][1]) {
                    max = branch[i][1];
                    maxIndex = i;
                }
            }

            if(!maxIndex || !branch[maxIndex]) {
                break;
            }

            maxPattern.push(maxIndex);
            branch = branch[maxIndex][0];
        } 

        return new SearchResult(null, maxPattern, this.decoder.DecodeReadable(maxPattern));
    }

    private indexedSparseTree(pattern: Array<number>, level: number, branch: any[], base: number) {
        if(level >= pattern.length) {
            return;
        }
        const index = pattern[level];

        if(branch[index]) {
            branch[index][1]++;
        } else {
            branch[index] = [new Array(base), 1];
        }
        this.indexedSparseTree(pattern, level+1, branch[index][0], base);
    }

}