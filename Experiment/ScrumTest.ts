import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { SoftwareTest } from "./SoftwareTest"
import { Statistics } from "../Simulation/Statistics"

export class ScrumTest extends SoftwareTest {

    public readonly Name: string = "Scrum";

    public readonly Description: string = `
Simulation of a cross functional "Scrum" team with some supporting "Component" teams.
In this scenario, backlog is "ready" before the Sprint starts, in this simulation it means that there is no dependency, developers and testers don't have to 
wait to start the work.`;

    protected readonly teamConfig = new TeamConfig([
            new MemberConfig("Product Owner", 10/37, 8/10, 4/100),
            new MemberConfig("UX", 10/37, 4/10, 10/100),
            new MemberConfig("Architecture", 5/37, 5/10, 5/100),
            new MemberConfig("Back-End", 37/37, 8/10, 30/100),
            new MemberConfig("Front-End", 37/37, 8/10, 30/100),
            new MemberConfig("Test", 37/37, 10/10, 20/100),
            new MemberConfig("Product Owner Sign Off", 1/37, 10/10, 1/100)
        ],
        [
            /***
             * Bottom 0 diagonal represents flow downstream dependencies (prerequisite work)
             * top 0 diagonal represents flow "feedback" upstream 
             *  PO  UX   ARCH  BE      FE   TEST   POS <= X-axis is same "mirror" for Y-axis, order is the same as above order
             */
                [0, 1/2, 1/5, 1/2,   1/5,   1/5,   0],
                [0, 0,   1/5,   0,   1/5,   1/5,   1/50],
                [0, 0,      0, 1/5,  1/10,    0,   0],
                [0, 0,      0,   0,   1/2,  1/2,   1/50],
                [0, 0,      0,   0,     0,  1/2,   1/20],
                [0, 0,      0,   1,     1,    0,   1/10],
                [0, 0,      0,   0,     0,    1,  0],
            /*** 
             * With graph provides a dependency map for prerequisite work, meaning the following will happen:
             * If story contains work for product owner then it will have to travel through product owner before 
             * it goes to UX, ARCH, BE, FE and TEST. 
             * If story has no product owner involvement and it has UX involvement, then it FE has to wait for UX to do their bit.
             * When it comes to feedback, it travels backward so a tester might give some feedback per 1 story out of 2 to FE and 
             * 1 out of 10 story feedback to PO and UX. 
             */
        ]
    );

}