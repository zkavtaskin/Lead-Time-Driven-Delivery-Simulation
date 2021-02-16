

export class TeamMemberMetrics {
    Id: number;
    Name: string;
    TimeIdle: number;
    SkipPrerequisite: number;
    SkipNotMyTurn: number;

    constructor(id : number, name : string, timeIdle : number, skipPreq : number, skipNotMy : number) {
      this.Id = id;
      this.Name = name;
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