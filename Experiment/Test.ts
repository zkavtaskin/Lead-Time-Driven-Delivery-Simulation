import { Data} from "./Data"
import { TestResult} from "./TestResult"
import { Statistics } from "../Simulation/Statistics";
import { TeamConfig } from "../Simulation/TeamConfig";
import { BacklogConfig } from "../Simulation/BacklogConfig";
import { Result } from "./Result";
import { TeamMetrics } from "../Simulation/TeamMetrics";
import { TeamMemberMetrics } from "../Simulation/TeamMemberMetrics";

export abstract class Test {

    public abstract readonly Name : string;
    public abstract readonly Description : string;

    protected abstract readonly teamConfig : TeamConfig;
    protected abstract readonly backlogConfig : BacklogConfig;
    protected abstract readonly effortPerTick: number;

    protected abstract assumptions(control : Data) : Array<[string, boolean]>
    protected abstract controlGroup() : Data;
    protected abstract experimentGroup() : Data;

    public Run() : TestResult {
        const control = this.controlGroup();
        const assumptions = this.assumptions(control);
        const experiment = this.experimentGroup();

        const nullHypothesis = Statistics.MoodsMedianTest(control.LeadTime, experiment.LeadTime);
        return new TestResult(assumptions, new Result(control), new Result(experiment), nullHypothesis);
    }

    protected Sample(experiment : () => TeamMetrics, nSamples : number = 30) : [Array<number>, Array<number>, Array<TeamMemberMetrics>] {
        let leadTimeSamples = new Array<number>(),
              cycleTimeSamples = new Array<number>(),
              teamMembersSamples = new Map<number, TeamMemberMetrics>();

        for(let i = 0; i < nSamples; i++) {
            const teamMetrics = experiment();
            leadTimeSamples = leadTimeSamples.concat(teamMetrics.Backlog.LeadTimeData);
            cycleTimeSamples = cycleTimeSamples.concat(teamMetrics.Backlog.CycleTimeData);
            teamMetrics.Members.forEach((teamMemberSample) => {
                let teamMemberSamples = teamMembersSamples.get(teamMemberSample.Id);
                if(teamMemberSamples == null) {
                    teamMemberSamples = new TeamMemberMetrics(teamMemberSample.Id, teamMemberSample.Name)
                    teamMembersSamples.set(teamMemberSample.Id, teamMemberSamples);
                }
                teamMemberSamples.Combine(teamMemberSample);
            });
        }

        return [
                leadTimeSamples, 
                cycleTimeSamples,
                Array.from(teamMembersSamples.values())
            ];
    }
}