import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { SoftwareTest } from "./SoftwareTest"
import { Statistics } from "../Simulation/Statistics"

export class ScrumPartialStackTest extends SoftwareTest {

    public readonly Name: string = "Scrum Partial Stack";

    public readonly Description: string = `
Simulation of a cross functional partial stack "Scrum" team with some supporting "Component" teams.
In this scenario, there are same amount of people, however they are cross skilled so they can pick up each other's work.`;


    protected readonly teamConfig = new TeamConfig([
            new MemberConfig("Product Owner / Test Upstream", 10/37, 8/10, 14/100),
            new MemberConfig("UX", 10/37, 4/10, 10/100),
            new MemberConfig("Architecture", 5/37, 5/10, 5/100),
            new MemberConfig("Back-End / Front-End", 37/37, 8/10, 30/100),
            new MemberConfig("Front-End / Back-End", 37/37, 8/10, 30/100),
            new MemberConfig("Test Review", 37/37, 10/10, 10/100),
            new MemberConfig("Product Owner Sign Off", 1/37, 10/10, 1/100)
        ],
        [
                [0, 1/3, 1/10, 1/5,   1/5,   1/5,   0],
                [0, 0,   1/10,   0,   1/3,   1/5,   1/50],
                [0, 0,      0, 1/5,  1/10,    0,   0],
                [0, 0,      0,   0,     0,    1/5,   1/20],
                [0, 0,      0,   0,     0,    1/5,   1/20],
                [0, 0,      0,   1,     1,    0,   1/10],
                [0, 0,      0,   0,     0,    1,  0],
        ]
    );
}