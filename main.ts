import { MemberConfig } from "./Simulation/MemberConfig";
import { BacklogConfig } from "./Simulation/BacklogConfig";
import { TeamSimulation } from "./Simulation/TeamSimulation";
import { TeamConfig } from "./Simulation/TeamConfig";

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

let teamSimulation = new TeamSimulation("*", teamConfig, backlogConfig, 0.5);
let stats = teamSimulation.Run().GetStats();
console.log(stats);

/*
 Write the stats test
 start working on the optimisation algo
*/