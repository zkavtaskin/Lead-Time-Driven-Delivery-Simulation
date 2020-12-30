import { expect } from 'chai';
import { Trees } from "../Optimisation/Trees";

describe('Trees', () => {
    it('BranchAndBound, given n=3, 3+3*2+3*2*1 unique cobinations returned', () => {
        const combinations = Trees.BranchAndBound(3, null);
        expect(combinations.length).to.equal(3+3*2+3*2*1);
    })
});
    