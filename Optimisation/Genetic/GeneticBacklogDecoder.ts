import { TeamConfig } from "../../Simulation/TeamConfig";
import { Story } from "../../Simulation/Story";

export class GeneticBacklogDecoder {

    public readonly ChromoLen : number;
    public readonly Population : number;
    public readonly GeneLen : number;

    private decodeMap = new Map<number, (a : Story, b : Story) => number>();
    private decodeReadableMap = new Map<number, string>();

    constructor(teamConfig : TeamConfig) {

        this.decodeMap.set(0, this.orderByPrerequisite);
        this.decodeReadableMap.set(0, "PrerequisiteId");

        for(let teamMemberId = 0; teamMemberId < teamConfig.Members.length; teamMemberId++) {
            this.decodeMap.set(teamMemberId + 1, (a, b) => this.orderByTeamMember(teamMemberId, a, b));
            this.decodeReadableMap.set(teamMemberId + 1, teamConfig.Members[teamMemberId].Name);
        }
        this.GeneLen = this.decodeMap.size;
        this.ChromoLen = Math.pow(this.GeneLen, 2);
        //TODO; find optimal number
        this.Population = this.ChromoLen * 10;
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

    public Decode(chromosome : Array<number>) : (a : Story, b : Story) => number {
        const genesOrdered = this.createOrderedGenes(chromosome);
        const lambda = (a : Story, b : Story, index : number) => {  
            if(index < 0) return;
            return this.decodeMap.get(genesOrdered[index][0])(a, b) || lambda(a, b, index-1);
        }
       return (a, b) => lambda(a, b, genesOrdered.length-1);
    }

    public DecodeReadable(chromosome : Array<number>) : Array<string> {
        const genesOrdered = this.createOrderedGenes(chromosome);
        const decoded = new Array<string>();
        for(let i = genesOrdered.length-1; i >= 0; i--) {
            decoded.push( this.decodeReadableMap.get(genesOrdered[i][0]));
        }
        return decoded;
    }

    private createOrderedGenes(gene : Array<number>) : Array<[number, number]> {
        let genesOrdered = new Array<[number, number]>();
        for(let i = 0, head = i * this.GeneLen; i < this.GeneLen; i++, head = i * this.GeneLen) {
            if(gene[head] == 1) {
                const order = parseInt(gene.slice(head+1, head + this.GeneLen).reverse().join(''), 2);
                genesOrdered.push([i, order]);
            }
        }
        return genesOrdered.sort((a, b) => { return b[1]-a[1]});
    }

    private orderByPrerequisite(a : Story, b : Story) : number {
        if(!a.HasPrerequisite() && !b.HasPrerequisite())
            return 0;

        if(!a.HasPrerequisite())
            return -1;
        
        if(!b.HasPrerequisite())
            return 1;

        return a.PrerequisiteId-b.PrerequisiteId; 
    }

    private orderByTeamMember(teamMemberId : number, a : Story, b : Story) : number {
        if(a.Tasks[teamMemberId] == null && b.Tasks[teamMemberId] == null)
        return 0;

        if(a.Tasks[teamMemberId] == null)
            return -1;

        if(b.Tasks[teamMemberId] == null)
            return 1;

        return a.Tasks[teamMemberId].Remaining-b.Tasks[teamMemberId].Remaining; 
    }
}