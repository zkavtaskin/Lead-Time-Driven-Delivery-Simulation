
export class TeamMemberMetrics {
    private id: number;
    private name: string;
    private timeIdle: number;
    private skipPrerequisite: number;
    private skipNotMyTurn: number;
    private givenFeedback: number;
    private count : number;

    get Id() : number {
      return this.id;
    }

    get Name() : string {
      return this.name;
    }

    get TimeIdle() : number {
      return this.timeIdle / this.count;
    }

    get SkipPrerequisite() : number {
      return this.skipPrerequisite / this.count;
    }

    get SkipNotMyTurn() : number {
      return this.skipNotMyTurn / this.count;
    }

    get GivenFeedback() : number {
      return this.givenFeedback / this.count;
    }

    constructor(id : number, name : string, timeIdle : number = 0, skipPreq : number = 0, skipNotMy : number = 0, givenFeedback : number = 0) {
      this.id = id;
      this.name = name;
      this.timeIdle = timeIdle;
      this.skipPrerequisite = skipPreq;
      this.skipNotMyTurn = skipNotMy;
      this.givenFeedback = givenFeedback;
      this.count = 1;
    }

    public Combine(teamMemberMetric : TeamMemberMetrics) {
      if(teamMemberMetric.id != this.id){
        throw new Error("Id's don't match");
      }
      this.timeIdle += teamMemberMetric.timeIdle;
      this.skipPrerequisite += teamMemberMetric.skipPrerequisite;
      this.skipNotMyTurn += teamMemberMetric.skipNotMyTurn;
      this.givenFeedback += teamMemberMetric.givenFeedback;
      this.count++;
    }
  }