import { Clock } from "./Clock";
import { Backlog } from "./Backlog";
import { MemberConfig } from "./MemberConfig";

export class TeamMemberMetrics {
    Id: number;
    TimeIdle: number;
    SkipPrerequisite: number;
    SkipNotMyTurn: number;

    constructor(id : number, timeIdle : number, skipPreq : number, skipNotMy : number) {
      this.Id = id;
      this.TimeIdle = timeIdle;
      this.SkipPrerequisite = skipPreq;
      this.SkipNotMyTurn = skipNotMy;
    }
  }