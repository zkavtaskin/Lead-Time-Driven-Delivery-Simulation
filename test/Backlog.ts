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
    }),
    it('Generate backlog with 1 story for 1 team member, story has no prerequisite as it is the only story', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.Stories[0].HasPrerequisite()).to.equal(false);
    }),
    it('Generate backlog with 2 stories for 1 team member, first story has a dependency on the second, but second not on the first.', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.Stories[0].HasPrerequisite()).to.equal(true);
        expect(backlog.Stories[1].HasPrerequisite()).to.equal(false);
    }),
    it('Generate backlog with 1 story for 1 team member, story has deadline', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.Stories[0].Deadline).to.equal(true);
    }),
    it('Generate backlog with 1 story for 1 team member, task has work', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.Stories[0].HasWork(0)).to.equal(true);
    })
});
