import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { Story } from "../Simulation/Story";

export class GeneticDecoderBacklog {

    public readonly GeneLen : number;
    public readonly Population : number;
    public readonly ChromoLen : number;

    private decodeMap = new Map<number, (a : Story, b : Story) => number>();

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig) {

        this.decodeMap.set(0, (a, b) => { return a.PrerequisiteId-b.PrerequisiteId; });
        for(let i = 0; i < teamConfig.Members.length; i++) {
            this.decodeMap.set(i + 1, (a, b) => { return a.Tasks[i].Remaining-b.Tasks[i].Remaining; })
        }
        this.ChromoLen = this.decodeMap.keys.length;
        this.GeneLen = Math.pow(this.ChromoLen, 2);
        this.Population = this.GeneLen * 100;
    }

    public GetRandom() : Array<number> {
        return new Array<number>(this.GeneLen).fill(Math.round(Math.random()));
    }

    public Decode(gene : Array<number>) : (a : Story, b : Story) => number {

        let chromosOrdered = new Array<[number, number]>();
        for(let chromoIndex = 0, chromoHead = chromoIndex * this.ChromoLen; chromoIndex < this.ChromoLen; chromoIndex++, chromoHead = chromoIndex * this.ChromoLen) {
            if(gene[chromoHead] == 1) {
                const order = parseInt(gene.slice(chromoHead+1, this.ChromoLen-1).join(''), 2);
                chromosOrdered.push([chromoIndex, order]);
            }
        }
        chromosOrdered.sort((a, b) => { return a[1]-b[1] });
        
        let lambda : (a : Story, b : Story) => number = null;
        chromosOrdered.forEach(chromoOrdered => {
            const chromoHeadIndex = chromoOrdered[0];
            if(lambda == null) {
                lambda = this.decodeMap[chromoHeadIndex];
            } else {
                lambda = (a : Story, b : Story) => {
                    const sortCompare = lambda(a, b);
                    if(sortCompare != 0)
                        return sortCompare;
                    
                    return this.decodeMap[chromoHeadIndex](a, b);
                }
    
            }
        });
        return lambda;
    }
}