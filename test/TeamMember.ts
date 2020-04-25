import { expect } from 'chai';
import { TeamMember } from '../Simulation/TeamMember';
import { Backlog } from '../Simulation/Backlog';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';
import { Clock } from '../Simulation/Clock';

describe('TeamMember', () => {
    it('DoWork', () => {
        let teamGraph = [
            [1, 0],
            [0, 0]
        ]
        let membersConfig = [
                new MemberConfig("PO", 1, 1, 1/2),
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 5);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[1], teamGraph);
        teamMember.DoWork(backlog, clock);
    })
});