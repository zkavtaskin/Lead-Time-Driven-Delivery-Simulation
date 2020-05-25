import { MemberConfig } from "./Simulation/MemberConfig";
import { BacklogConfig } from "./Simulation/BacklogConfig";
import { TeamSimulation } from "./Simulation/TeamSimulation";
import { TeamConfig } from "./Simulation/TeamConfig";
import { GeneticBacklog } from "./Optimisation/GeneticBacklog";
import { BacklogStats } from "./Simulation/BacklogStats";

let teamConfig = new TeamConfig([
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

let backlogConfig = new BacklogConfig(1000, 1/10, 1/10, 1, 30);

console.log("Direct simulation")
let teamSimulationDirect = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
let statsDirect = teamSimulationDirect.Run().GetStats();
console.log(JSON.stringify(statsDirect));

console.log("Null Hypothesis Test");
let teamSimulationDirect2 = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
let statsDirect2 = teamSimulationDirect2.Run().GetStats();
let nullHypothesis = BacklogStats.GetSignificance(statsDirect.CycleTime.Mean, statsDirect.CycleTime.Std, statsDirect.CycleTime.Count, statsDirect2.CycleTime.Mean, 0.01);
console.log(nullHypothesis);
/*

console.log("Backlog optimised simulation")
let geneticBacklog = new GeneticBacklog(teamConfig, backlogConfig, 0.5);
for(let result of geneticBacklog.Search()) {
        console.log(JSON.stringify(result));
}
*/