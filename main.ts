import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
        \n ### Scrum Team Experiment
        \n # Control 
        \n   mean: ${scrumTeamResult.ControlStats.Mean}, median: ${scrumTeamResult.ControlStats.Median}, std: ${scrumTeamResult.ControlStats.Std}, skew: ${scrumTeamResult.ControlStats.Skew}
        \n # Experiment 
        \n   mean: ${scrumTeamResult.ExperimentStats.Mean}, median: ${scrumTeamResult.ExperimentStats.Median}, std: ${scrumTeamResult.ExperimentStats.Std}, skew: ${scrumTeamResult.ExperimentStats.Skew}
        \n   conditions: ${scrumTeamResult.ExperimentConditions}
        \n # Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

