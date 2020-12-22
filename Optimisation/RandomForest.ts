import { Result } from "..//Optimisation/Result"
import { BacklogDecoder } from "./BacklogDecoder"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser";

export class RandomForest {
    Solve(optimiser:BacklogOptimiser, decoder:BacklogDecoder, sample:number = 50) : Result {
        //grow the forest
        const results = new Array<Result>();
        for(let i=0; i < sample; i++) {
            results.push(optimiser.Search());
        }

        const tree = new Array<number>(0);
        //reduce the forest by growing split tree
        for(let i=0; i < results.length; i++) {
            this.indexedSparseTree(results[i].BestEncoding, 0, tree, decoder.Base);
        }

        //traverse the tree to find the majority vote
        let branch = tree, maxPattern = Array<number>();
        while(branch != null) {
            let max = 0, maxIndex = null;
            for(let i=0; i < decoder.Base; i++) {
                if(max < branch[i][1] && 3 <= branch[i][1]) {
                    max = branch[i][1];
                    maxIndex = i;
                }
            }
            branch = branch[maxIndex][0];
            maxPattern.push(maxIndex);
        } 

        return new Result(null, maxPattern, decoder.DecodeReadable(maxPattern));
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
        this.indexedSparseTree(pattern, level++, branch[index][0], base);
    }

}