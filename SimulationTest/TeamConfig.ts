import { expect } from 'chai';
import { MemberConfig } from '../Simulation/MemberConfig';
import { TeamConfig } from '../Simulation/TeamConfig';

describe('TeamConfig', () => {
    it('Team config capacity is mutated, original team config was not mutated', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]

        const teamConfig = new TeamConfig(membersConfig, teamGraph);
        const teaConfigMutated = teamConfig.ChangeMembersCapacity([2]);
        expect(teamConfig.Members[0].Capacity).to.equal(1);
        expect(teaConfigMutated.Members[0].Capacity).to.equal(2);
    })
});