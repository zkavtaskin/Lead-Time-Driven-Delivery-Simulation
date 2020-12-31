import {ScrumTeamExperiment} from "./Experiment/ScrumTeamExperiment"

const scrumTeamExp = new ScrumTeamExperiment();
const scrumTeamResult = scrumTeamExp.Run();

console.log(`
###  ${scrumTeamExp.Name} Experiment
${scrumTeamExp.Description}
# Assumptions
${scrumTeamResult.Assumptions.reduce((s,a,i) => s+((i+1) + ": " + a[0] + " => " + a[1] + "\n"), "")} 
# Control 
  Lead Time - Max: ${scrumTeamResult.ControlStats.Max} ticks, Uniformity Deviation: ${scrumTeamResult.ControlStats.Frequency} 
# Experiment 
  Lead Time - Max: ${scrumTeamResult.ExperimentStats.Max} ticks, Uniformity Deviation: ${scrumTeamResult.ExperimentStats.Frequency}
  conditions: ${scrumTeamResult.ExperimentConditions}
# Null Hypothesis: ${scrumTeamResult.NullHypothesis == null ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}`);

