import { MemberConfig } from "./MemberConfig";

export class TeamConfig {

    readonly Members :Array<MemberConfig>;
    readonly Graph :Array<Array<number>>;
    constructor(memberConfig : Array<MemberConfig>, graph :Array<Array<number>>) {
        this.Members = memberConfig;
        this.Graph = graph;
    }

    ChangeMembersCapacity(membersCapacity : Array<number>) : TeamConfig {
        const graph = this.Graph.map((g) => g.slice());
        const members = new Array<MemberConfig>();
        this.Members.forEach((m, i) => {
            members.push(new MemberConfig(m.Name, membersCapacity[i], m.BacklogFrequency, m.BacklogContribution))
        })
        return new TeamConfig(members, graph);
    }

}