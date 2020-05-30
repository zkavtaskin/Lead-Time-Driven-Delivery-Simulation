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

let backlogConfig = new BacklogConfig(100, 1/10, 1/10, 1, 30);


console.log("\n#Sampling")
let numberOfSamplesToGet = 10, sampleMean = 0, sampleStd = 0;
for(let i = 0; i < numberOfSamplesToGet; i++) {
        let teamSimulationSample = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
        let sample = teamSimulationSample.Run().GetStats();
        console.log(`Getting sample ${i}, lead time mean: ${sample.LeadTime.Mean}`);
        sampleMean += sample.LeadTime.Mean;
        sampleStd += sample.LeadTime.Std;
}
sampleMean = sampleMean / numberOfSamplesToGet;
sampleStd = sampleStd / numberOfSamplesToGet;
console.log(`->Sample mean: ${sampleMean}, std: ${sampleStd}<-`);


console.log("\n#Random Null Hypothesis Test");
let teamSimulationRandom = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
let statsRandom = teamSimulationRandom.Run().GetStats();
console.log(`Random sample mean: ${statsRandom.LeadTime.Mean} std: ${statsRandom.LeadTime.Std}`);
let nullHypothesis = BacklogStats.GetSignificance(sampleMean, sampleStd, numberOfSamplesToGet, statsRandom.LeadTime.Mean, 0.05);
console.log(`->Null Hypothesis:${nullHypothesis}<-`);


console.log("\n#Looking for optimial backlog sort")
let geneticBacklog = new GeneticBacklog(teamConfig, backlogConfig, 0.5);
let bestScore = null, bestScoreDecoded = null, attempts = 0;
for(let result of geneticBacklog.Search()) {
        console.log(`Score: ${result.BestScore}, Sort: ${result.BestEncodingDecoded}`);
        if(bestScore == null) {
                bestScore =  result.BestScore;
                bestScoreDecoded = result.BestEncodingDecoded;
        } else {
                const improvement = (bestScore - result.BestScore) / bestScore;
                console.log(` ->improvement from best score: ${(improvement*100).toFixed(1)}%`);

                if(bestScore > result.BestScore) {
                        bestScore = result.BestScore;
                        bestScoreDecoded = result.BestEncodingDecoded;
                }
                
                if(improvement < 0.01 && attempts++ >= 5) 
                        break;
        }
}
console.log(`->Final best score: ${bestScore}, sort: ${bestScoreDecoded}<-`);

console.log("\n#Running Null Hypothesis Test for optimised solution");
console.log(`Testing original mean ${statsRandom.LeadTime.Mean} against optimised mean ${bestScore}.`)
let nullHypothesisOptimised = BacklogStats.GetSignificance(sampleMean, sampleStd, numberOfSamplesToGet, bestScore, 0.05);
console.log(`->Null Hypothesis:${nullHypothesisOptimised}<-`);

