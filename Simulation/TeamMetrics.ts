import { TeamMemberMetrics } from "./TeamMemberMetrics";
import { BacklogRuntimeMetrics } from "./BacklogRuntimeMetrics";

export class TeamMetrics {
    Members : Array<TeamMemberMetrics>
    Backlog : BacklogRuntimeMetrics

    constructor(members : Array<TeamMemberMetrics>, backlog : BacklogRuntimeMetrics)  {
        this.Members = members;
        this.Backlog = backlog;
    }
}