import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
        \n ### Scrum Team Experiment
        \n # Assumptions
        \n   ${scrumTeamResult.Assumptions.map((a, i) => (i+1) + ": " + a[0] + " => " + a[1] + "\n   ").join("")} 
        \n # Control 
        \n   mean: ${scrumTeamResult.ControlStats.Mean}, median: ${scrumTeamResult.ControlStats.Median}, std: ${scrumTeamResult.ControlStats.Std}, skew: ${scrumTeamResult.ControlStats.Skew}, kurt: ${scrumTeamResult.ControlStats.Kurtosis}
        \n # Experiment 
        \n   mean: ${scrumTeamResult.ExperimentStats.Mean}, median: ${scrumTeamResult.ExperimentStats.Median}, std: ${scrumTeamResult.ExperimentStats.Std}, skew: ${scrumTeamResult.ExperimentStats.Skew}, kurt: ${scrumTeamResult.ExperimentStats.Kurtosis}
        \n   conditions: ${scrumTeamResult.ExperimentConditions}
        \n # Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

