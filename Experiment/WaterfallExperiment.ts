import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { SoftwareTest } from "./SoftwareTest"
import { Statistics } from "../Simulation/Statistics"

export class WaterfallExperiment extends SoftwareTest {

    public readonly Name: string = "Waterfall";

    public readonly Description: string = `
Simulation of a Waterfall team, work is passed from one department to the other. 
With this approach everything is a dependency, work must be completed at each stage before it is passed to the next stage.`;

    protected readonly teamConfig = new TeamConfig([
            new MemberConfig("Product Owner", 10/37, 8/10, 4/100),
            new MemberConfig("UX", 10/37, 4/10, 10/100),
            new MemberConfig("Architecture", 5/37, 5/10, 5/100),
            new MemberConfig("Back-End", 37/37, 8/10, 30/100),
            new MemberConfig("Front-End", 37/37, 8/10, 30/100),
            new MemberConfig("Test", 37/37, 10/10, 20/100),
            new MemberConfig("Product Owner Sign Off", 1/37, 10/10, 1/100)],
        [
                [0, 1/3, 1/10, 1/5,   1/5,   1/5,   0],
                [1, 0,   1/10,   0,   1/3,   1/5,   1/50],
                [1, 1,      0, 1/5,  1/10,    0,   0],
                [1, 1,      1,   0,   1/2,  1/2,   1/50],
                [1, 1,      1,   1,     0,  1/2,   1/20],
                [1, 1,      1,   1,     1,    0,   1/10],
                [1, 1,      1,   1,     1,    1,  0],
        ]
    );
}