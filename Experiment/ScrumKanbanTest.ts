import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { Statistics } from "../Simulation/Statistics"
import { SoftwareTest } from "./SoftwareTest"

export class ScrumKanbanTest extends SoftwareTest {

    public readonly Name: string = "Scrum Kanban";

    public readonly Description: string = `
Simulation of a cross functional "Scrum" team working using Kanban approach with some supporting "Component" teams.
In this scenario, with Kanban approach assumption is that there is no ready backlog, so teams are waiting for work to be refined. 
As work is refined and it is team members turn work is pulled. Main difference with this approach is that there are a lot of dependencies as work gets handed over.`;

    public readonly teamConfig = new TeamConfig([
            new MemberConfig("Product Owner", 10/37, 8/10, 4/100),
            new MemberConfig("UX", 10/37, 4/10, 10/100),
            new MemberConfig("Architecture", 5/37, 5/10, 5/100),
            new MemberConfig("Back-End", 37/37, 8/10, 30/100),
            new MemberConfig("Front-End", 37/37, 8/10, 30/100),
            new MemberConfig("Test", 37/37, 10/10, 20/100),
            new MemberConfig("Product Owner Sign Off", 1/37, 10/10, 1/100)],
        [
                [0, 1/3, 1/10, 1/5,   1/5,   1/5,   0],
                [1, 0,   1/10,   0,   1/3,   1/5,   1/20],
                [1, 1,      0, 1/5,  1/10,    0,   0],
                [1, 0,      1,   0,   1/2,  1/2,   1/20],
                [1, 1,      1,   0,     0,  1/2,   1/20],
                [1, 1,      0,   1,     1,    0,   1/10],
                [0, 0,      0,   0,     0,    1,  0],
        ]
    );
}