import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
        \n ###  ${scrumTeamExp.Name} Experiment
        \n ${scrumTeamExp.Description}
        \n # Assumptions
        \n   ${scrumTeamResult.Assumptions.reduce((s,a,i) => s+((i+1) + ": " + a[0] + " => " + a[1] + "\n   "), "")} 
        \n # Control 
        \n   mean: ${scrumTeamResult.ControlStats.Mean}, median: ${scrumTeamResult.ControlStats.Median}, std: ${scrumTeamResult.ControlStats.Std}
        \n # Experiment 
        \n   mean: ${scrumTeamResult.ExperimentStats.Mean}, median: ${scrumTeamResult.ExperimentStats.Median}, std: ${scrumTeamResult.ExperimentStats.Std}
        \n   conditions: ${scrumTeamResult.ExperimentConditions}
        \n # Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

