import { Test } from "./Experiment/Test";
import {ScrumKanbanTest} from "./Experiment/ScrumKanbanTest"
import {ScrumTest} from "./Experiment/ScrumTest"
import {WaterfallExperiment} from "./Experiment/WaterfallExperiment"
import {ScrumPartialStackTest} from "./Experiment/ScrumPartialStackTest"
import { Statistics } from "./Simulation/Statistics";
import { Result } from "./Experiment/Result";

/*
const scrumTest = new ScrumTest();
const testResult = scrumTest.Run();
console.log("Max", testResult.Control.LeadTime.Max);
console.log("Idle Time Sum", testResult.Control.TeamMembersIdleSum);
console.log("Score", (testResult.Control.TeamMembersIdleSum*10) + testResult.Control.LeadTime.Max);
*/


const results = [];
for(let i = 0; i < 200; i++) {
  const scrumTest = new ScrumTest();
  const b1 = Math.random() * 5;
  const b2 = Math.random() * 5;
  const b3 = Math.random() * 5;
  const b4 = Math.random() * 5;
  const b5 = Math.random() * 5;
  const b6 = Math.random() * 5;
  const b7 = Math.random() * 5;
  scrumTest.teamConfig.Members[0].Capacity = b1*scrumTest.teamConfig.Members[0].Capacity;
  scrumTest.teamConfig.Members[1].Capacity = b2*scrumTest.teamConfig.Members[1].Capacity;
  scrumTest.teamConfig.Members[2].Capacity = b3*scrumTest.teamConfig.Members[2].Capacity;
  scrumTest.teamConfig.Members[3].Capacity = b4*scrumTest.teamConfig.Members[3].Capacity;
  scrumTest.teamConfig.Members[4].Capacity = b5*scrumTest.teamConfig.Members[4].Capacity;
  scrumTest.teamConfig.Members[5].Capacity = b6*scrumTest.teamConfig.Members[5].Capacity;
  scrumTest.teamConfig.Members[6].Capacity = b7*scrumTest.teamConfig.Members[6].Capacity;
  const x1 = scrumTest.teamConfig.Members[0].Capacity;
  const x2 = scrumTest.teamConfig.Members[1].Capacity;
  const x3 = scrumTest.teamConfig.Members[2].Capacity;
  const x4 = scrumTest.teamConfig.Members[3].Capacity;
  const x5 = scrumTest.teamConfig.Members[4].Capacity;
  const x6 = scrumTest.teamConfig.Members[5].Capacity;
  const x7 = scrumTest.teamConfig.Members[6].Capacity;
  const testResult = scrumTest.Run();
  const y1 = testResult.Control.TeamMembersIdleSum;
  const y2 = testResult.Control.LeadTime.Max;
  results.push([x1, x2, x3, x4, x5, x6, x7, y1, y2]);
}

const output = results.reduce((s, result) => 
  (s + result.reduce((s, v) => 
    s + "," + Statistics.ToDecimalPlace(v, 2),"") + "\n"), "");

console.log(output);



/*
const experiments = new Array<Test>(new ScrumTest(), new ScrumKanbanTest(), new ScrumPartialStackTest(), new WaterfallExperiment());

console.log(`
Experiments search for:
    1) Shortest lead time
    2) Follows as close uniform distribution as possible  
    3) Delivers biggest amount of stories (value), this is a given as under the experiment everyone needs to deliver set amount of stories.  
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
## Constraint
Member: ${result.Constraint}, Uniformity Deviation: ${Statistics.ToDecimalPlace(result.TeamMembersIdleFrequency)}
## Team Members
${result.TeamMembers.reduce((s,m) => s+(m.Name + " => idle days " + Statistics.ToDecimalPlace(m.TimeIdle.Median,0) + ", turn count: waiting " + Statistics.ToDecimalPlace(m.SkipNotMyTurn.Median,1) + ", preq " + Statistics.ToDecimalPlace(m.SkipPrerequisite.Median,1) + ", feedback " + Statistics.ToDecimalPlace(m.GivenFeedback.Median,1) + "\n"), "")}`;
}
*/