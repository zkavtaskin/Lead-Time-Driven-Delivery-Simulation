import { Test } from "./Experiment/Test";
import {ScrumKanbanTest} from "./Experiment/ScrumKanbanTest"
import {ScrumTest} from "./Experiment/ScrumTest"
import {WaterfallExperiment} from "./Experiment/WaterfallExperiment"
import {ScrumPartialStackTest} from "./Experiment/ScrumPartialStackTest"
import { Statistics } from "./Simulation/Statistics";
import { Result } from "./Experiment/Result";

const experiments = new Array<Test>(new ScrumTest(), new ScrumKanbanTest(), new ScrumPartialStackTest(), new WaterfallExperiment());

console.log(`
Experiments search for:
    1) Shortest lead time
    2) Follows as close uniform distribution as possible  
    3) Delivers biggest amount of stories (value), this is a given as under the experiment everyone needs to deiver set amount of stories.  
As a starting point experiment will be setup to have a bias towards delivering work right at the end the cycle.
`);

experiments.forEach((experiment) => {
  const results = experiment.Run();
  console.log(`
##############################START###################################
###  ${experiment.Name} Experiment
${experiment.Description}

# Assumptions
${results.Assumptions.reduce((s,a,i) => s+((i+1) + ": " + a[0] + " => " + a[1] + "\n"), "")} 

# Control 
${resultView(results.Control, results.EffortPerTick)}

# Experiment 
${resultView(results.Experiment, results.EffortPerTick)}

# Control vs Experiment (Null Hypothesis): ${results.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}
##############################END###################################
`);

});

function resultView(result : Result, tickSize : number) {
  return `Total mean man-days: original ${Statistics.ToDecimalPlace(result.WorkSizeOriginalMean)}, actual ${Statistics.ToDecimalPlace(result.WorkSizeActualMean)}
Conditions: ${result.Conditions}
## Lead Time 
Uniformity Deviation: ${result.LeadTime.Frequency}, Skew: ${result.LeadTime.Skew}
*When* delivered: 
First 25% delivered on day ${result.LeadTime.Quartiles[0] * tickSize}, 50% ${result.LeadTime.Quartiles[1] * tickSize}, 75% ${result.LeadTime.Quartiles[2] * tickSize}, last 25% ${result.LeadTime.Max * tickSize}
## Cycle Time
*Time taken* to deliver once started: 
25% has taken ${result.CycleTime.Quartiles[0] * tickSize} day(s), 50% ${result.CycleTime.Quartiles[1] * tickSize}, 75% ${result.CycleTime.Quartiles[2] * tickSize}, last 25% ${result.CycleTime.Max * tickSize}
## Team Members
${result.TeamMembers.reduce((s,m) => s+(m.Name + " => idle days " + Statistics.ToDecimalPlace(m.TimeIdle,0) + ", turn count: waiting " + Statistics.ToDecimalPlace(m.SkipNotMyTurn,1) + ", preq " + Statistics.ToDecimalPlace(m.SkipPrerequisite,1) + ", feedback " + Statistics.ToDecimalPlace(m.GivenFeedback,1) + "\n"), "")}`;
}