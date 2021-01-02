import { expect } from 'chai';
import { TeamSimulation } from '../Simulation/TeamSimulation';
import { TeamConfig } from '../Simulation/TeamConfig';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';

describe('TeamSimulation', () => {
    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, it takes 1 tick to get a story done by 2 team members, chances of PO getting feedback 1 out of 2', () => {
        const teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        const backlogConfig = new BacklogConfig(1, 0, 0, 1);

        const teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.5);
        expect(teamSimulation.TeamConfig.Graph[0][1]).to.equal(1/2);
    }),

    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, it takes 2 ticks to get a story done, due to normalisation chance of PO getting feedback is 1 out of 4 (1/4*2=1/2)', () => {
        const teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        const backlogConfig = new BacklogConfig(1, 0, 0, 1);

        const teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.25);
        expect(teamSimulation.TeamConfig.Graph[0][1]).to.equal(0.25);
    }),

    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, determistic mode is true, all feedback is set to 0', () => {
        const teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        const backlogConfig = new BacklogConfig(1, 0, 0, 1);

        const teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.5, null, true);
        expect(teamSimulation.TeamConfig.Graph[0][1]).to.equal(0);
    }),

    it('Run, original team config and backlog config does not get mutated', () => {
        const teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        const backlogConfig = new BacklogConfig(10, 0, 0, 1);

        const teamConfigExpected = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        const backlogConfigExpected = new BacklogConfig(10, 0, 0, 1);

        const teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.25);
        teamSimulation.Run();

        expect(teamConfig).to.eql(teamConfigExpected);
        expect(backlogConfig).to.eql(backlogConfigExpected);
    })
});