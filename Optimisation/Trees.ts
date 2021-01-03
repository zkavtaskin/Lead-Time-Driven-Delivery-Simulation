
export class Trees {

    /***
     * BranchAndBound based on https://en.wikipedia.org/wiki/Branch_and_bound, this function
     * is used to find the optimal answer to a combinatorial problem. 
     * @param nCombinations number from 0 to nCombinations 
     * @param optimisation_function function that evaluates pattern, against some optimisation and responds with true if search should continue and false if this combination branch should terminate. 
     * @returns all remaining / possible combinations   
     * 
     * This function is literal, it creates a bag filled with elements, it then removes item from the bag,
     * removed element is then used to form a pattern. It keeps doing this for all possible combinations of a bag state.
     */
    public static BranchAndBound(nCombinations:number, optimisation_function:(combination : Array<number>) => boolean) : Array<Array<number>> {
        //create a bag full of numbers from 0 to nCombinations 
        const bagOrigin:Array<number> = [...Array(nCombinations).keys()];
        //create tree with first element being the full bag and the second element being empty pattern 
        const tree = [[[...bagOrigin], []]];
        //optimisation function should test no combinations 
        if(optimisation_function) {
            optimisation_function([]);
        }
        const combinations = [];
        let branch = null;
        while(branch = tree.shift()) {
            //go through the entire bag, at each instance take 1 item out and from that create a new pattern 
            //by appending this new item that was taken out to the pattern element 
            for(let i:number = 0; i < branch[0].length; i++) {
                const bagReduced = [...branch[0]];
                const combinationNew = [...branch[1]];
                const omittedElement = bagReduced.splice(i, 1)[0];
                combinationNew.push(omittedElement);
                //see if there is optimisation function present, if it is, see if 
                //search needs to continue or this particular combination tree should terminate 
                if(optimisation_function && !optimisation_function(combinationNew)) {
                    continue;
                }
                tree.push([bagReduced, combinationNew]);
                combinations.push(combinationNew);
            }
        } 
        return combinations;
    }

    /***
     * BranchCounter counts discrete element occurrences within the array. For example given 
     * [0, 2] and [0, 1] ordered elements calling DiscreteCounter([0, 2], tree, 3) and DiscreteCounter([0, 1], tree, 3)
     * would create the following tree 
     * [
     *      [
     *          [
     *              [],
     *              [
     *                  [[],[],[]],
     *                  [1]
     *              ],
     *              [
     *                  [[],[],[]],
     *                  [1]
     *              ],
     *          ],
     *          [2]
     *      ],
     *      [],
     *      []
     * ]
     * @param oredered ordered array with discrete unique numbers such as [0,1,2,3,4] or [1,2,3,0]
     * @param branch prefilled initialized array 
     */
    public static BranchCounter(ordered: Array<number>, branch: any[], base: number, level: number = 0) : void {
        if(level >= ordered.length) {
            return;
        }
        //current level in the array, get the value
        //value becomes the index
        const index = ordered[level];

        //if current branch already initialised this index increment, 
        //if not initialise at 1 with new sub array
        if(branch[index]) {
            branch[index][1]++;
        } else {
            branch[index] = [new Array(base), 1];
        }

        //recurse through the array creating new branches 
        Trees.BranchCounter(ordered, branch[index][0], base, level+1);
    }

    public static BranchCounterMax(tree: any[], base: number) : Array<number> {
        let branch = tree, maxPattern = Array<number>();
        while(true) {
            let max = 0, maxIndex = null;
            for(let i=0; i < base; i++) {
                if(branch[i] && max < branch[i][1] && 3 <= branch[i][1]) {
                    max = branch[i][1];
                    maxIndex = i;
                }
            }

            if(maxIndex == null || branch[maxIndex] == null) {
                break;
            }

            maxPattern.push(maxIndex);
            branch = branch[maxIndex][0];
        } 
        return maxPattern;
    }

}