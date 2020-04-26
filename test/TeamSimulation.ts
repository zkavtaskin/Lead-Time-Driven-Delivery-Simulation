import { expect } from 'chai';
import { TeamSimulation } from '../Simulation/TeamSimulation';
import { TeamConfig } from '../Simulation/TeamConfig';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';

describe('TeamSimulation', () => {
    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, it takes 1 tick to get a story done, chances are 1/2', () => {

        let teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 1/2),
            new MemberConfig("DEV", 1, 1, 1/2)
        ],[
         [0, 1/2],
         [1, 0]]);
        let backlogConfig = new BacklogConfig(1, 0, 0, 1, 0);

        let teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 1);
        expect(teamConfig.Graph[0][1]).to.equal(1/2);
    }),
    it('Graph feedback normalisation by interval, 1 in 2 stories get feedback, it takes 1/2 tick to get a story done, chances are 1/4', () => {

        let teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 1/2),
            new MemberConfig("DEV", 1, 1, 1/2)
        ],[
         [0, 1/2],
         [1, 0]]);
        let backlogConfig = new BacklogConfig(1, 0, 0, 1, 0);

        let teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 0.5);
        expect(teamConfig.Graph[0][1]).to.equal(1/4);
    })
});