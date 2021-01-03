import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
###  ${scrumTeamExp.Name} Experiment
${scrumTeamExp.Description}
# Assumptions
${scrumTeamResult.Assumptions.reduce((s,a,i) => s+((i+1) + ": " + a[0] + " => " + a[1] + "\n"), "")} 
# Control 
  Lead Time - Max: ${scrumTeamResult.ControlStats.Max}, Mean: ${scrumTeamResult.ControlStats.Mean}, Sum: ${scrumTeamResult.ControlStats.Sum}, Uniformity Deviation: ${scrumTeamResult.ControlStats.Frequency} 
# Experiment 
  Lead Time - Max: ${scrumTeamResult.ExperimentStats.Max}, Mean: ${scrumTeamResult.ExperimentStats.Mean}, Sum: ${scrumTeamResult.ExperimentStats.Sum}, Uniformity Deviation: ${scrumTeamResult.ExperimentStats.Frequency}
  Conditions: ${scrumTeamResult.ExperimentConditions}
# Null Hypothesis: ${scrumTeamResult.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

