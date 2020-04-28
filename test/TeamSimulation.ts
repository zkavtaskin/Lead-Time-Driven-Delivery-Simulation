import { expect } from 'chai';
import { TeamSimulation } from '../Simulation/TeamSimulation';
import { TeamConfig } from '../Simulation/TeamConfig';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';

describe('TeamSimulation', () => {
    it('Graph feedback normalisation by interval, 1/2 stories get feedback, it takes 1 tick to get a story done by 2 team members, chances of PO getting feedback 1 out of 2', () => {

        let teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        let backlogConfig = new BacklogConfig(1, 0, 0, 1);

        let teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.5);
        expect(teamConfig.Graph[0][1]).to.equal(1/2);
    }),
    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, it takes 2 ticks to get a story done, chance of PO getting feedback is 1 out of 4', () => {

        let teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 0.5),
            new MemberConfig("DEV", 1, 1, 0.5)
        ],[
         [0, 1/2],
         [1, 0]]);
        let backlogConfig = new BacklogConfig(1, 0, 0, 1);

        let teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.25);
        expect(teamConfig.Graph[0][1]).to.equal(0.25);
    })
});