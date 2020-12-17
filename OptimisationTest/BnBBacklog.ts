import { expect } from 'chai';
import { TeamConfig } from "../Simulation/TeamConfig";
import { BnBBacklog } from "../Optimisation/BranchBound/BnBBacklog";
import { MemberConfig } from '../Simulation/MemberConfig';
import { Story } from '../Simulation/Story';
import { Task } from '../Simulation/Task';

describe('BnBBacklog', () => {
    it('generateCombinations, given n=3, 3+3*2+3*2*1 unique cobinations returned', () => {
        const combinations = BnBBacklog.generateCombinations(3, null);
        expect(combinations.length).to.equal(3+3*2+3*2*1);
    })
});
    