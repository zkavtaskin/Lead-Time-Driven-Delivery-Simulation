import { MemberConfig } from "./Simulation/MemberConfig";
import { BacklogConfig } from "./Simulation/BacklogConfig";
import { TeamSimulation } from "./Simulation/TeamSimulation";
import { TeamConfig } from "./Simulation/TeamConfig";
import { GeneticBacklog } from "./Optimisation/Genetic/GeneticBacklog";
import { BnBBacklog } from "./Optimisation/BranchBound/BnBBacklog";
import { BnBBacklogDecoder } from "./Optimisation/BranchBound/BnBBacklogDecoder";
import { BacklogOptimiser } from "./Optimisation/BacklogOptimiser";
import { BacklogStats } from "./Simulation/BacklogStats";
import { Result } from "./Optimisation/Result";
import { GeneticBacklogDecoder } from "./Optimisation/Genetic/GeneticBacklogDecoder";

const teamConfig = new TeamConfig([
                new MemberConfig("Product Owner", 10/37, 8/10, 10/100),
                new MemberConfig("UX", 10/37, 2/10, 5/100),
                new MemberConfig("Architecture", 5/37, 2/10, 5/100),
                new MemberConfig("Back-End", 37/37, 8/10, 35/100),
                new MemberConfig("Front-End", 37/37, 8/10, 35/100),
                new MemberConfig("Test", 37/37, 10/10, 10/100)], 
        [
                [0, 1/5, 1/10, 1/5,   1/5, 1/10],
                [1, 0,   1/10,   0,   1/5, 1/10],
                [1, 0,      0, 1/5,  1/10,    0],
                [1, 0,      1,   0,   1/2,  1/2],
                [1, 1,      1,   0,     0,  1/2],
                [0, 0,      0,   1,     1,    0] 
        ]
);

const backlogConfig = new BacklogConfig(100, 1/10, 1/10, 1, 30);

console.log("\n#Expected");
let teamSimulationExpected = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
const expectedLeadTime  = teamSimulationExpected.Run().GetStats().LeadTime;
console.log(`->Expected average mean: ${expectedLeadTime.Mean}<-`);


console.log("\n#Control, Null Hypothesis Test");
const teamSimulationControl = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
const controlLeadTime = teamSimulationControl.Run().GetStats().LeadTime;
console.log(`Control mean: ${controlLeadTime.Mean} std: ${controlLeadTime.Std}`);
const nullHypothesis = BacklogStats.TwoSampleTest(expectedLeadTime, controlLeadTime);
console.log(`->Null Hypothesis:${nullHypothesis}<-`);


const backlogOptimiser = new BnBBacklog(teamConfig, backlogConfig, 0.5) as BacklogOptimiser;
const result = backlogOptimiser.Solve();
console.log(`->Final best score: ${result.BestScore}, sort: ${result.BestEncodingDecoded}<-`);


console.log("\n#Experiment, Null Hypothesis Test");
const backlogDecoder = new BnBBacklogDecoder(teamConfig);
const teamSimulationOptimised = new TeamSimulation("*", teamConfig, backlogConfig, 0.5, backlogDecoder.Decode(result.BestEncoding));
const optimisedLeadTime = teamSimulationOptimised.Run().GetStats().LeadTime;


console.log(`Testing expected mean ${expectedLeadTime.Mean} against optimised mean ${result.BestScore}.`)
let nullHypothesisOptimised = BacklogStats.TwoSampleTest(expectedLeadTime, optimisedLeadTime);
console.log(`->Null Hypothesis:${nullHypothesisOptimised}<-`);

