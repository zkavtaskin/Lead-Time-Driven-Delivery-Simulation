

export class TeamMemberMetrics {
    Id: number;
    Name: string;
    TimeIdle: number;
    SkipPrerequisite: number;
    SkipNotMyTurn: number;

    constructor(id : number, name : string, timeIdle : number = 0, skipPreq : number = 0, skipNotMy : number = 0) {
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