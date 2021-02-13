import { Test } from "./Experiment/Test";
import {ScrumKanbanTest} from "./Experiment/ScrumKanbanTest"
import {ScrumTest} from "./Experiment/ScrumTest"
import {WaterfallExperiment} from "./Experiment/WaterfallExperiment"
import {ScrumPartialStackTest} from "./Experiment/ScrumPartialStackTest"

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
## Lead Time
Uniformity Deviation: ${results.Control.LeadTime.Frequency}
Day *when* work was delivered: 
First 25% delivered on day ${results.Control.LeadTime.Quartiles[0]}, 50% ${results.Control.LeadTime.Quartiles[1]}, 75% ${results.Control.LeadTime.Quartiles[2]}, last 25% ${results.Control.LeadTime.Max}
## Cycle Time
*Time taken* to deliver once started: 
25% has taken ${results.Control.CycleTime.Quartiles[0]} day(s), 50% ${results.Control.CycleTime.Quartiles[1]}, 75% ${results.Control.CycleTime.Quartiles[2]}, last 25% ${results.Control.CycleTime.Max}

# Experiment 
Conditions: ${results.Experiment.Conditions}
## Lead Time 
Uniformity Deviation: ${results.Experiment.LeadTime.Frequency}
Day *when* work was delivered: 
First 25% delivered on day ${results.Experiment.LeadTime.Quartiles[0]}, 50% ${results.Experiment.LeadTime.Quartiles[1]}, 75% ${results.Experiment.LeadTime.Quartiles[2]}, last 25% ${results.Experiment.LeadTime.Max}
## Cycle Time
*Time taken* to deliver once started: 
25% has taken ${results.Experiment.CycleTime.Quartiles[0]} day(s), 50% ${results.Experiment.CycleTime.Quartiles[1]}, 75% ${results.Experiment.CycleTime.Quartiles[2]}, last 25% ${results.Experiment.CycleTime.Max}

# Control vs Experiment (Null Hypothesis): ${results.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}
##############################END###################################
`);

});