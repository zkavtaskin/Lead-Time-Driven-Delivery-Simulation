import { expect } from 'chai';
import { TeamMember } from '../Simulation/TeamMember';
import { Backlog } from '../Simulation/Backlog';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';
import { Clock } from '../Simulation/Clock';

describe('TeamMember', () => {
    it('Team Member completes 1 story in one tick', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 1);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.Work(backlog, clock);
        expect(backlog.IsCompleted).to.equal(true);
    }),
    it('Team Member is out of time, story is not completed', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 10);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.Work(backlog, clock);
        expect(backlog.IsCompleted).to.equal(false);
    }),
    it('Team Member can not complete work in one turn, with 2 turns completes the work', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 10);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(5);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.Work(backlog, clock);
        teamMember.Work(backlog, clock);
        expect(backlog.IsCompleted).to.equal(true);
    }),
    it('Team Member can not complete work as there is prerequisite', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1)
        ]
        let backlogConfig = new BacklogConfig(2, 1, 0, 1);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.Work(backlog, clock);
        expect(backlog.IsCompleted).to.equal(false);
    }),
    it('Team Member can  complete work as  prerequisite is completed', () => {
        let teamGraph = [
            [0]
        ]
        let membersConfig = [
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(2, 1, 0, 1);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(1);

        let teamMember = new TeamMember(0, membersConfig[0], teamGraph);
        teamMember.Work(backlog, clock);
        teamMember.Work(backlog, clock);
        expect(backlog.IsCompleted).to.equal(true);
    }),

    it('Team Member can not do the work as there is dependency upstream', () => {
        let teamGraph = [
            [0, 0],
            [1, 0]
        ];
        let membersConfig = [
                new MemberConfig("PO", 1, 1, 1/2),
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 5);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(5);

        let DevTeamMember = new TeamMember(1, membersConfig[1], teamGraph);
        DevTeamMember.Work(backlog, clock);
        let POTeamMember = new TeamMember(0, membersConfig[0], teamGraph);
        POTeamMember.Work(backlog, clock);

        expect(backlog.IsCompleted).to.equal(false);
    }),
    it('Team Member can do the work as there is no upstream dependency', () => {
        let teamGraph = [
            [0, 0],
            [1, 0]
        ];
        let membersConfig = [
                new MemberConfig("PO", 1, 1, 1/2),
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 5);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(5);

        let POTeamMember = new TeamMember(0, membersConfig[0], teamGraph);
        POTeamMember.Work(backlog, clock);
        let DevTeamMember = new TeamMember(1, membersConfig[1], teamGraph);
        DevTeamMember.Work(backlog, clock);

        expect(backlog.IsCompleted).to.equal(true);
    }),
    it('DEV found a problem and gave feedback to the PO, work is not completed', () => {
        let teamGraph = [
            [0, 1],
            [1, 0]
        ];
        let membersConfig = [
                new MemberConfig("PO", 1, 1, 1/2),
                new MemberConfig("DEV", 1, 1, 1/2)
        ]
        let backlogConfig = new BacklogConfig(1, 0, 0, 5);
        let backlog = Backlog.Generate(membersConfig, backlogConfig);
        let clock = new Clock(5);

        let POTeamMember = new TeamMember(0, membersConfig[0], teamGraph);
        POTeamMember.Work(backlog, clock);
        let DevTeamMember = new TeamMember(1, membersConfig[1], teamGraph);
        DevTeamMember.Work(backlog, clock);

        expect(backlog.IsCompleted).to.equal(false);
        expect(backlog.Find(0).Tasks[0].Actual > backlog.Find(0).Tasks[0].Original).to.equal(true);
    })
});