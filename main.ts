import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
###  ${scrumTeamExp.Name} Experiment
${scrumTeamExp.Description}
# Assumptions
${scrumTeamResult.Assumptions.reduce((s,a,i) => s+((i+1) + ": " + a[0] + " => " + a[1] + "\n"), "")} 
# Control 
  mean: ${scrumTeamResult.ControlStats.Mean}, median: ${scrumTeamResult.ControlStats.Median}, std: ${scrumTeamResult.ControlStats.Std}
# Experiment 
  mean: ${scrumTeamResult.ExperimentStats.Mean}, median: ${scrumTeamResult.ExperimentStats.Median}, std: ${scrumTeamResult.ExperimentStats.Std}
  conditions: ${scrumTeamResult.ExperimentConditions}
# Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

