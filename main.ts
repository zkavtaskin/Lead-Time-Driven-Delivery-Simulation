import { Test } from "./Experiment/Test";
import {ScrumKanbanTest} from "./Experiment/ScrumKanbanTest"
import {ScrumTest} from "./Experiment/ScrumTest"
import {WaterfallExperiment} from "./Experiment/WaterfallExperiment"
import {ScrumPartialStackTest} from "./Experiment/ScrumPartialStackTest"
import { Statistics } from "./Simulation/Statistics";

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
Total mean man-days: original ${Statistics.ToDecimalPlace(results.Control.WorkSizeOriginalMean)}, actual ${Statistics.ToDecimalPlace(results.Control.WorkSizeActualMean)}
## Lead Time
Uniformity Deviation: ${results.Control.LeadTime.Frequency}, Skew: ${results.Control.LeadTime.Skew}
*When* delivered: 
First 25% delivered on day ${results.Control.LeadTime.Quartiles[0]  }, 75% ${results.Control.LeadTime.Quartiles[2] * results.EffortPerTick}, last 25% ${results.Control.LeadTime.Max * results.EffortPerTick}
## Cycle Time
*Time taken* to deliver once started: 
25% has taken ${results.Control.CycleTime.Quartiles[0] * results.EffortPerTick} day(s), 50% ${results.Control.CycleTime.Quartiles[1] * results.EffortPerTick}, 75% ${results.Control.CycleTime.Quartiles[2] * results.EffortPerTick}, last 25% ${results.Control.CycleTime.Max * results.EffortPerTick}
## Team Members
${results.Control.TeamMembers.reduce((s,m,i) => s+(m.Name + " => idle days " + Statistics.ToDecimalPlace(m.TimeIdle,0) + ", skip waiting count: turn " + m.SkipNotMyTurn * results.EffortPerTick + ", preq: " + m.SkipPrerequisite * results.EffortPerTick + "\n"), "")} 

# Experiment 
Total mean man-days: original ${Statistics.ToDecimalPlace(results.Experiment.WorkSizeOriginalMean)}, actual ${Statistics.ToDecimalPlace(results.Experiment.WorkSizeActualMean)}
Conditions: ${results.Experiment.Conditions}
## Lead Time 
Uniformity Deviation: ${results.Experiment.LeadTime.Frequency}, Skew: ${results.Experiment.LeadTime.Skew}
*When* delivered: 
First 25% delivered on day ${results.Experiment.LeadTime.Quartiles[0] * results.EffortPerTick}, 50% ${results.Experiment.LeadTime.Quartiles[1] * results.EffortPerTick}, 75% ${results.Experiment.LeadTime.Quartiles[2] * results.EffortPerTick}, last 25% ${results.Experiment.LeadTime.Max * results.EffortPerTick}
## Cycle Time
*Time taken* to deliver once started: 
25% has taken ${results.Experiment.CycleTime.Quartiles[0] * results.EffortPerTick} day(s), 50% ${results.Experiment.CycleTime.Quartiles[1] * results.EffortPerTick}, 75% ${results.Experiment.CycleTime.Quartiles[2] * results.EffortPerTick}, last 25% ${results.Experiment.CycleTime.Max * results.EffortPerTick}
## Team Members
${results.Experiment.TeamMembers.reduce((s,m) => s+(m.Name + " => idle days " + Statistics.ToDecimalPlace(m.TimeIdle,0) + ", skip waiting count: turn " + m.SkipNotMyTurn * results.EffortPerTick + ", preq " + m.SkipPrerequisite * results.EffortPerTick + "\n"), "")} 


# Control vs Experiment (Null Hypothesis): ${results.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}
##############################END###################################
`);

});