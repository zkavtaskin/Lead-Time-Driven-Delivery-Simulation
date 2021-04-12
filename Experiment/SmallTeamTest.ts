import { TeamConfig} from "../Simulation/TeamConfig"
import { MemberConfig } from "../Simulation/MemberConfig"
import { BacklogConfig } from "../Simulation/BacklogConfig"
import { SoftwareTest } from "./SoftwareTest"
import { Statistics } from "../Simulation/Statistics"

export class SmallTeamTest extends SoftwareTest {

    public readonly Name: string = "Small Team Test";

    public readonly Description: string = `
...`;

    protected readonly teamConfig = new TeamConfig(
        [
            new MemberConfig("PO", 10/37, 10/10, 10/100),
            new MemberConfig("Dev", 37/37, 10/10, 90/100)
        ],
        [
            [0, 1/3],
            [1, 0]
        ]
    );

}