import { TeamMemberMetrics } from "../Simulation/TeamMemberMetrics";
import { TeamMetrics } from "../Simulation/TeamMetrics";

export class Data {
    protected leadTime : Array<number> = new Array<number>();
    protected cycleTime : Array<number> = new Array<number>();
    protected teamMembers : Map<number, TeamMemberMetrics> = new Map<number, TeamMemberMetrics>();
    protected workSizeOriginal : number = 0;
    protected workSizeActual : number = 0;
    protected count : number = 0;
    protected conditions : Array<[string, string]> = new Array<[string, string]>();

    get LeadTime() : Array<number> {
        return this.leadTime;
    }

    get CycleTime() : Array<number> {
        return this.cycleTime;
    }

    get TeamMembers() : Array<TeamMemberMetrics> {
        return Array.from(this.teamMembers.values());
    }

    get Conditions() : Array<[string, string]> {
        return this.conditions;
    }

    get WorkSizeOriginalMean() : number {
        return this.workSizeOriginal / this.count;
    }

    get WorkSizeActualMean() : number {
        return this.workSizeActual / this.count;
    }

    public AddMetrics(teamMetrics : TeamMetrics) {
        this.count++;
        this.leadTime = this.leadTime.concat(teamMetrics.Backlog.LeadTimeData);
        this.cycleTime = this.cycleTime.concat(teamMetrics.Backlog.CycleTimeData);
        teamMetrics.Members.forEach((teamMemberSample) => {
            let teamMemberSamples = this.teamMembers.get(teamMemberSample.Id);
            if(teamMemberSamples == null) {
                teamMemberSamples = new TeamMemberMetrics(teamMemberSample.Id, teamMemberSample.Name)
                this.teamMembers.set(teamMemberSample.Id, teamMemberSamples);
            }
            teamMemberSamples.Combine(teamMemberSample);
        });
        this.workSizeOriginal += teamMetrics.Backlog.SizeOriginal;
        this.workSizeActual += teamMetrics.Backlog.SizeActual;
    } 

    public AddCondition(conditions : Array<[string, string]> ) {
        this.conditions = this.conditions.concat(conditions);
    } 
}