import { Result } from "..//Optimisation/Result"
import { BacklogOptimiser } from "../Optimisation/BacklogOptimiser";

export class RandomForest {
    Solve(optimiser:BacklogOptimiser, sample:number = 50) : Result {
        //grow the forest
        const results = new Array<Result>();
        for(let i=0; i < sample; i++) {
            results.push(optimiser.Solve());
        }

        //reduce the forest by growing split tree
        for(let i=0; i < results.length; i++) {
            this.sparseTree(results[i].BestEncoding, 0, tree, optimiser.Base);
        }

        //traverse the tree to find the majority vote
        let patternMajority = Array<number>(), branch = tree;
        do {
            let best = Number.NEGATIVE_INFINITY, bestIndex = null;
            for(let j=0; j < optimiser.Base; j++) {
                if(best < branch[j][1] && 3 <= branch[j][1]) {
                    best = branch[j][1];
                    bestIndex = j;
                }
            }
            branch = branch[bestIndex][0];
            patternMajority.push(bestIndex);
        } while(branch != null)

        return null;
    }

    private sparseTree(pattern, index, branch, base) {
        if(index >= pattern.length) 
            return;

        const id = pattern[index];

        if(branch[id] == null) 
            branch[id] = [new Array(base), 1];
        else 
            branch[id][1]++;

        this.sparseTree(pattern, index++, branch[id][0], base);
    }

}