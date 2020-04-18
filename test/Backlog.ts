import { expect } from 'chai';
import { Backlog } from '../Simulation/Backlog';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';

describe('Backlog', () => {
    it('Generate backlog with 1 story for 1 team member, contains 1 story for 1 team member', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.Stories.length).to.equal(1);
        expect(backlog.Stories[0].Tasks.length).to.equal(1);
    })
});
