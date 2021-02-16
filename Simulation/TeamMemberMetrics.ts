

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

    public Combine(teamMemberMetric : TeamMemberMetrics) {
      if(teamMemberMetric.Id != this.Id){
        throw new Error("Id's don't match");
      }
      this.TimeIdle += teamMemberMetric.TimeIdle;
      this.SkipPrerequisite += teamMemberMetric.SkipPrerequisite;
      this.SkipNotMyTurn += teamMemberMetric.SkipNotMyTurn;
    }
  }