import { expect } from 'chai';
import { TeamSimulation } from '../Simulation/TeamSimulation';
import { TeamConfig } from '../Simulation/TeamConfig';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';
import { Backlog } from '../Simulation/Backlog';
import { Clock } from '../Simulation/Clock';

describe('TeamSimulation', () => {
    it('Graph calibarated, full time capacity matches existing feedback', () => {

        let teamConfig = new TeamConfig([
            new MemberConfig("PO", 1, 1, 1/2),
            new MemberConfig("DEV", 1, 1, 1/2)
        ],[
         [0, 1/2],
         [1, 0]]);
        let backlogConfig = new BacklogConfig(1, 0, 0, 1, 0);

        let teamSimulation = new TeamSimulation("", teamConfig, backlogConfig, 1);
        expect(teamConfig.Graph[0][1]).to.equal(1/2);
    })
});