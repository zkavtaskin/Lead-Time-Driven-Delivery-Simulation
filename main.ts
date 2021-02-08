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
Lead Time - Quartiles Q1:${results.Control.Bins[results.Control.Quartiles[0]]}, Q2:${results.Control.Bins[results.Control.Quartiles[1]]}, Q3:${results.Control.Bins[results.Control.Quartiles[2]]}
Max Bin: ${results.Control.Max[0] * results.Control.BinRange}, Sum: ${results.Control.Sum}, Uniformity Deviation: ${results.Control.Uniformity}
# Experiment 
Lead Time - Quartiles Q1:${results.Experiment.Bins[results.Experiment.Quartiles[0]]}, Q2:${results.Experiment.Bins[results.Experiment.Quartiles[1]]}, Q3:${results.Experiment.Bins[results.Experiment.Quartiles[2]]}
Max Bin: ${results.Experiment.Max[0] * results.Experiment.BinRange}, Sum: ${results.Experiment.Sum}, Uniformity Deviation: ${results.Experiment.BinRange}

Conditions: ${results.ExperimentConditions}

# Null Hypothesis: ${results.NullHypothesis ? "No difference (Not Rejected)" : "Significant difference (Rejected)"}
##############################END###################################
`);

});