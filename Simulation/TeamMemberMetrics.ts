import { Statistics } from "./Statistics";
import { StatisticsDescriptive } from "./StatisticsDescriptive";

export class TeamMemberMetrics {
    private id: number;
    private name: string;
    private timeIdleData : Array<number>;
    private skipPrerequisiteData : Array<number>;
    private givenFeedbackData : Array<number>;
    private skipNotMyTurnData: Array<number>;

    get Id() : number {
      return this.id;
    }

    get Name() : string {
      return this.name;
    }

    get TimeIdleData() : Array<number> {
      return this.timeIdleData;
    }

    get TimeIdle() : StatisticsDescriptive {
      return Statistics.Describe(this.timeIdleData);
    }

    get SkipPrerequisiteData() : Array<number> {
      return this.skipPrerequisiteData;
    }

    get SkipPrerequisite() : StatisticsDescriptive {
      return Statistics.Describe(this.skipPrerequisiteData);
    }

    get SkipNotMyTurnData() : Array<number> {
      return this.skipNotMyTurnData;
    }

    get SkipNotMyTurn() : StatisticsDescriptive {
      return Statistics.Describe(this.skipNotMyTurnData);
    }

    get GivenFeedbackData() : Array<number> {
      return this.givenFeedbackData;
    }

    get GivenFeedback() : StatisticsDescriptive {
      return Statistics.Describe(this.givenFeedbackData)
    }

    constructor(id : number, name : string, timeIdle : number = 0, skipPreq : number = 0, skipNotMy : number = 0, givenFeedback : number = 0) {
      this.id = id;
      this.name = name;
      this.timeIdleData =  [timeIdle];
      this.skipPrerequisiteData = [skipPreq];
      this.skipNotMyTurnData = [skipNotMy];
      this.givenFeedbackData = [givenFeedback];
    }

    public Combine(teamMemberMetric : TeamMemberMetrics) {
      if(teamMemberMetric.id != this.id){
        throw new Error("Id's don't match");
      }
      this.timeIdleData = this.timeIdleData.concat(teamMemberMetric.TimeIdleData);
      this.skipPrerequisiteData = this.skipPrerequisiteData.concat(teamMemberMetric.SkipPrerequisiteData);
      this.skipNotMyTurnData = this.skipNotMyTurnData.concat(teamMemberMetric.SkipNotMyTurnData)
      this.givenFeedbackData = this.givenFeedbackData.concat(teamMemberMetric.GivenFeedbackData);
    }
  }