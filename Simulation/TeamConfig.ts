import { MemberConfig } from "./MemberConfig";

export class TeamConfig {

    readonly Members :Array<MemberConfig>;
    readonly Graph :Array<Array<number>>;
    constructor(memberConfig : Array<MemberConfig>, graph :Array<Array<number>>) {
        this.Members = memberConfig;
        this.Graph = graph;
    }
}