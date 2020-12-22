import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
        \n ### Scrum Team Experiment
        \n # Control 
        \n   mean: ${scrumTeamResult.ControlStats.Mean}, std: ${scrumTeamResult.ControlStats.Std}
        \n # Experiment 
        \n   mean: ${scrumTeamResult.ExperimentStats.Mean}, std: ${scrumTeamResult.ExperimentStats.Std}
        \n   conditions: ${scrumTeamResult.ExperimentConditions}
        \n # Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

