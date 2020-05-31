import { MemberConfig } from "./Simulation/MemberConfig";
import { BacklogConfig } from "./Simulation/BacklogConfig";
import { TeamSimulation } from "./Simulation/TeamSimulation";
import { TeamConfig } from "./Simulation/TeamConfig";
import { GeneticBacklog } from "./Optimisation/GeneticBacklog";
import { BacklogStats } from "./Simulation/BacklogStats";
import { Result } from "./Optimisation/Result";
import { GeneticDecoderBacklog } from "./Optimisation/GeneticDecoderBacklog";

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


console.log("\n#Expected")
const teamSimulationExpected = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
const expectedLeadTime = teamSimulationExpected.Run().GetStats().LeadTime;
console.log(`->Expected mean: ${expectedLeadTime.Mean}<-`);


console.log("\n#Random Null Hypothesis Test");
const teamSimulationRandom = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
const randomLeadTime = teamSimulationRandom.Run().GetStats().LeadTime;
console.log(`Random sample mean: ${randomLeadTime.Mean} std: ${randomLeadTime.Std}`);
const nullHypothesis = BacklogStats.GetSignificance(randomLeadTime.Mean, randomLeadTime.Std, randomLeadTime.Count / expectedLeadTime.Count, expectedLeadTime.Mean, 0.05);
console.log(`->Null Hypothesis:${nullHypothesis}<-`);


console.log("\n#Looking for optimial backlog sort")
const geneticBacklog = new GeneticBacklog(teamConfig, backlogConfig, 0.5);
let bestScore : number = null, bestScoreResult : Result = null, attempts = 0;
for(let result of geneticBacklog.Search()) {
        console.log(`Score: ${result.BestScore}, Sort: ${result.BestEncodingDecoded}`);
        if(bestScore == null) {
                bestScore =  result.BestScore;
                bestScoreResult = result;
        } else {
                const improvement = (bestScore - result.BestScore) / bestScore;
                console.log(` ->improvement from best score: ${(improvement*100).toFixed(1)}%`);

                if(bestScore > result.BestScore) {
                        bestScore = result.BestScore;
                        bestScoreResult = result;
                }
                
                if(improvement < 0.01 && attempts++ >= 5) 
                        break;
        }
}
console.log(`->Final best score: ${bestScore}, sort: ${bestScoreResult.BestEncodingDecoded}<-`);

console.log("\n#Running Null Hypothesis Test for optimised solution");
const geneticDecoderBacklog = new GeneticDecoderBacklog(teamConfig);
const teamSimulationOptimised = new TeamSimulation("*", teamConfig, backlogConfig, 0.5, geneticDecoderBacklog.Decode(bestScoreResult.BestEncoding));
const optimisedLeadTime = teamSimulationOptimised.Run().GetStats().LeadTime;

console.log(`Testing expected mean ${expectedLeadTime.Mean} against optimised mean ${optimisedLeadTime.Mean}.`)
let nullHypothesisOptimised = BacklogStats.GetSignificance(optimisedLeadTime.Mean, optimisedLeadTime.Std, optimisedLeadTime.Count / expectedLeadTime.Count, bestScore, 0.05);
console.log(`->Null Hypothesis:${nullHypothesisOptimised}<-`);

