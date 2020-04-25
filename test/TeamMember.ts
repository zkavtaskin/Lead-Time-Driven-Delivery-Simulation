import { expect } from 'chai';
import { TeamMember } from '../Simulation/TeamMember';
import { Backlog } from '../Simulation/Backlog';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';
import { Clock } from '../Simulation/Clock';

describe('TeamMember', () => {
    it('Team Member completes 1 story in one tick', () => {
        let teamGraph = [
            [1]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 1, 0);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.DoWork(backlog, clock);
        expect(backlog.IsCompleted).to.equal(true);
    }),
    it('Team Member is out of time, story is not completed', () => {
        let teamGraph = [
            [1]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 10, 0);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.DoWork(backlog, clock);
        expect(backlog.IsCompleted).to.equal(false);
    }),
    it('Team Member can not complete work in one turn, with 2 turns completes the work', () => {
        let teamGraph = [
            [1]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 10, 0);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(5);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.DoWork(backlog, clock);
        teamMember.DoWork(backlog, clock);
        expect(backlog.IsCompleted).to.equal(true);
    })
});