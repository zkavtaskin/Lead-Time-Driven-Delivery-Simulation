import { TeamConfig } from "../Simulation/TeamConfig";
import { Story } from "../Simulation/Story";

export class GeneticDecoderBacklog {

    public readonly GeneLen : number;
    public readonly Population : number;
    public readonly ChromoLen : number;

    private decodeMap = new Map<number, (a : Story, b : Story) => number>();

    constructor(teamConfig : TeamConfig) {

        this.decodeMap.set(0, (a, b) => { 

            if(!a.HasPrerequisite() && !b.HasPrerequisite())
                return 0;

            if(!a.HasPrerequisite())
                return -1;
            
            if(!b.HasPrerequisite())
                return 1;

            return a.PrerequisiteId-b.PrerequisiteId; 
        });
        for(let i = 0; i < teamConfig.Members.length; i++) {
            this.decodeMap.set(i + 1, (a, b) => { return a.Tasks[i].Remaining-b.Tasks[i].Remaining; })
        }
        this.ChromoLen = this.decodeMap.size;
        this.GeneLen = Math.pow(this.ChromoLen, 2);
        this.Population = this.GeneLen * 100;
    }

    public GetRandom() : Array<number> {
        let currentChromoHeadActive = false;
        return Array.from({length: this.GeneLen}, (_, i) => { 

            const value = Math.round(Math.random());

            if(i % this.ChromoLen == 0) 
                currentChromoHeadActive = value != 0;

            if(currentChromoHeadActive) 
                return value;

            return 0;
        });
    }

    public Decode(gene : Array<number>) : (a : Story, b : Story) => number {

        let chromosOrdered = new Array<[number, number]>();
        for(let chromoIndex = 0, chromoHead = chromoIndex * this.ChromoLen; chromoIndex < this.ChromoLen; chromoIndex++, chromoHead = chromoIndex * this.ChromoLen) {
            if(gene[chromoHead] == 1) {
                const order = parseInt(gene.slice(chromoHead+1, chromoHead + this.ChromoLen).reverse().join(''), 2);
                chromosOrdered.push([chromoIndex, order]);
            }
        }
        chromosOrdered.sort((a, b) => { return b[1]-a[1]});

        const lambda = (a : Story, b : Story, index : number) => {  
            if(index < 0) return;
            return this.decodeMap.get(chromosOrdered[index][0])(a, b) || lambda(a, b, index-1);
        }
        /*
        return (a : Story, b : Story) => {
            let sortCompare = 0;
            for(let i = 0; i < chromosOrdered.length; i++) {
                sortCompare = this.decodeMap.get(chromosOrdered[i][0])(a, b);
                if(sortCompare != 0)
                    break;
            }
            return sortCompare;
        };
        */
       return (a, b) => lambda(a, b, chromosOrdered.length-1);
    }
}