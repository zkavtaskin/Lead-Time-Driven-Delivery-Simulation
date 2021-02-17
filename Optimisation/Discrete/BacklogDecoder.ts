import { TeamConfig } from "../../Simulation/TeamConfig";
import { Story } from "../../Simulation/Story";
import { DiscreteDecoder } from "../Discrete/DiscreteDecoder";

export class BacklogDecoder implements DiscreteDecoder {

    get Base() : number {
        return this.decodeMap.size;
    }

    private decodeMap = new Map<number, (a : Story, b : Story) => number>();
    private decodeReadableMap = new Map<number, string>();

    constructor(teamConfig : TeamConfig) {

        this.decodeMap.set(0, this.orderByPrerequisite);
        this.decodeReadableMap.set(0, "PrerequisiteId");

        this.decodeMap.set(1, this.orderBySizeLargest);
        this.decodeReadableMap.set(1, "OrderByLargest");

        this.decodeMap.set(2, this.orderBySizeSmallest);
        this.decodeReadableMap.set(2, "OrderBySmallest");

        for(let teamMemberId = 0; teamMemberId < teamConfig.Members.length; teamMemberId++) {
            this.decodeMap.set(teamMemberId + 3, (a, b) => this.orderByTeamMemberVolumeOfWork(teamMemberId, a, b));
            this.decodeReadableMap.set(teamMemberId + 3, teamConfig.Members[teamMemberId].Name);
        }
    }

    public Decode(pattern : Array<number>) : (a : Story, b : Story) => number {
        const lambda = (a : Story, b : Story, index : number) => {  
            if(pattern.length <= index) return;
            return this.decodeMap.get(pattern[index])(a, b) || lambda(a, b, index+1);
        }
       return (a, b) => lambda(a, b, 0);
    }

    public DecodeReadable(pattern : Array<number>) : Array<string> {
        const decoded = new Array<string>();
        for(let i = 0; i < pattern.length; i++) {
            decoded.push(this.decodeReadableMap.get(pattern[i]));
        }
        return decoded;
    }

    private orderBySizeLargest(a : Story, b : Story) : number {
        return a.SizeOriginal-b.SizeOriginal; 
    }

    private orderBySizeSmallest(a : Story, b : Story) : number {
        return b.SizeOriginal-a.SizeOriginal; 
    }

    private orderByPrerequisite(a : Story, b : Story) : number {
        if(!a.HasPrerequisite && !b.HasPrerequisite)
            return 0;

        if(!a.HasPrerequisite)
            return -1;
        
        if(!b.HasPrerequisite)
            return 1;

        return a.PrerequisiteId-b.PrerequisiteId; 
    }

    private orderByTeamMemberVolumeOfWork(teamMemberId : number, a : Story, b : Story) : number {
        if(a.Tasks[teamMemberId] == null && b.Tasks[teamMemberId] == null)
        return 0;

        if(a.Tasks[teamMemberId] == null)
            return -1;

        if(b.Tasks[teamMemberId] == null)
            return 1;

        return a.Tasks[teamMemberId].Remaining-b.Tasks[teamMemberId].Remaining; 
    }
}