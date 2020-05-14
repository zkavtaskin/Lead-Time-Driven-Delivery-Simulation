import { BacklogConfig } from "../Simulation/BacklogConfig";
import { TeamConfig } from "../Simulation/TeamConfig";
import { Story } from "../Simulation/Story";

export class GeneticEncoderBacklog {

    public readonly ChromosomeLength : number;
    public readonly Population : number;
    public readonly Bits : number;

    private decodeMap = new Map<number, (a : Story, b : Story) => number>();

    constructor(teamConfig : TeamConfig, backlogConfig : BacklogConfig) {
        this.decodeMap.set(0, (a, b) => { return a.PrerequisiteId-b.PrerequisiteId; });
        for(let i = 0; i < teamConfig.Members.length; i++) {
            this.decodeMap.set(i + 1, (a, b) => { return a.Tasks[i].Remaining-b.Tasks[i].Remaining; })
        }
        this.Bits = this.decodeMap.keys.length;
        this.ChromosomeLength = Math.pow(this.Bits, 2);
        this.Population = this.ChromosomeLength * 100;
    }

    public GetRandom() : Array<number> {
        return new Array<number>(this.ChromosomeLength).fill(Math.round(Math.random()));
    }

    public Decode(genes : Array<number>) : (a : Story, b : Story) => number {
        let lambda : (a : Story, b : Story) => number = null;

        for(let i = 0; i < this.Bits; i++) {

            if(genes[i * this.Bits] == 0) 
                continue;

            //TODO: decode binary order

            if(lambda == null) {
                lambda = this.decodeMap[i];
            } else {
                lambda = (a : Story, b : Story) => {
                    const sortCompare = lambda(a, b);
                    if(sortCompare != 0)
                        return sortCompare;
                    
                    return this.decodeMap[i](a, b);
                }

            }

        }
        return lambda;
    }
}