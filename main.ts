import { Experiment } from "./Experiment/Experiment";
import {ScrumKanbanExperiment} from "./Experiment/ScrumKanbanExperiment"
import {ScrumExperiment} from "./Experiment/ScrumExperiment"
import {WaterfallExperiment} from "./Experiment/WaterfallExperiment"
import {ScrumPartialStackExperiment} from "./Experiment/ScrumPartialStackExperiment"

const experiments = new Array<Experiment>(new ScrumExperiment(), new ScrumKanbanExperiment(), new ScrumPartialStackExperiment(), new WaterfallExperiment());

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
Lead Time - Max: ${results.ControlStats.Max}, Mean: ${results.ControlStats.Mean}, Sum: ${results.ControlStats.Sum}, Uniformity Deviation: ${results.ControlStats.Frequency}
Histogram (Count: ${results.ControlStats.Count})
${results.ControlStats.Histogram.reduce((s,v,i) => s+((i*100) + "-" + ((i+1)*100) + ":" + v + "\n"), "")} 
# Experiment 
Lead Time - Max: ${results.ExperimentStats.Max}, Mean: ${results.ExperimentStats.Mean}, Sum: ${results.ExperimentStats.Sum}, Uniformity Deviation: ${results.ExperimentStats.Frequency}
Histogram (Count: ${results.ExperimentStats.Count})
${results.ExperimentStats.Histogram.reduce((s,v,i) => s+((i*100) + "-" + ((i+1)*100) + ":" + v + "\n"), "")} 
Conditions: ${results.ExperimentConditions}

# Null Hypothesis: ${results.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}
##############################END###################################
`);

});