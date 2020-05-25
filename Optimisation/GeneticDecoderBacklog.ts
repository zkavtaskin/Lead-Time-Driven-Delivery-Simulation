import { TeamConfig } from "../Simulation/TeamConfig";
import { Story } from "../Simulation/Story";

export class GeneticDecoderBacklog {

    public readonly ChromoLen : number;
    public readonly Population : number;
    public readonly GeneLen : number;

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
            this.decodeMap.set(i + 1, (a, b) => { 
                if(a.Tasks[i] == null && b.Tasks[i] == null)
                    return 0;

                if(a.Tasks[i] == null)
                    return -1;

                if(b.Tasks[i] == null)
                    return 1;

                return a.Tasks[i].Remaining-b.Tasks[i].Remaining; 
            })
        }
        this.GeneLen = this.decodeMap.size;
        this.ChromoLen = Math.pow(this.GeneLen, 2);
        //TODO; find optimal number
        this.Population = this.ChromoLen * 2;
    }

    public GetRandom() : Array<number> {
        let currentGeneHeadActive = false;
        return Array.from({length: this.ChromoLen}, (v, i) => { 

            const value = Math.round(Math.random());

            if(i % this.GeneLen == 0) 
                currentGeneHeadActive = value != 0;

            if(currentGeneHeadActive) 
                return value;

            return 0;
        });
    }

    public Decode(gene : Array<number>) : (a : Story, b : Story) => number {

        let genesOrdered = new Array<[number, number]>();
        for(let i = 0, head = i * this.GeneLen; i < this.GeneLen; i++, head = i * this.GeneLen) {
            if(gene[head] == 1) {
                const order = parseInt(gene.slice(head+1, head + this.GeneLen).reverse().join(''), 2);
                genesOrdered.push([i, order]);
            }
        }
        genesOrdered.sort((a, b) => { return b[1]-a[1]});

        const lambda = (a : Story, b : Story, index : number) => {  
            if(index < 0) return;
            return this.decodeMap.get(genesOrdered[index][0])(a, b) || lambda(a, b, index-1);
        }

       return (a, b) => lambda(a, b, genesOrdered.length-1);
    }
}