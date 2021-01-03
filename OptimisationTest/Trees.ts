import { expect } from 'chai';
import { Trees } from "../Optimisation/Discrete/Trees";

describe('Trees', () => {
    it('BranchAndBound, given n=3, 3+3*2+3*2*1 unique cobinations returned', () => {
        const combinations = Trees.BranchAndBound(3, null);
        expect(combinations.length).to.equal(3+3*2+3*2*1);
    }),
    it('BranchAndBound, given n=3 and function returns false, no combinations are returned', () => {
        const combinations = Trees.BranchAndBound(3, (c) => false);
        expect(combinations.length).to.equal(0);
    }),
    it('BranchAndBound, given n=3 and function returns true, 3+3*2+3*2*1 unique cobinations returned', () => {
        const combinations = Trees.BranchAndBound(3, (c) => true);
        expect(combinations.length).to.equal(3+3*2+3*2*1);
    }),

    it('BranchCounter, given 3 instances of order numbers of length 1 at base 3 (0,1,2) are counted', () => {
        const tree = new Array(3);
        Trees.BranchCounter([0], tree, 3);
        Trees.BranchCounter([0], tree, 3);
        Trees.BranchCounter([1], tree, 3);
        expect(tree[0][1]).to.equal(2);
        expect(tree[1][1]).to.equal(1);
        expect(tree[2]).to.equal(undefined);
    }),
    it('BranchCounter, given 4 instances of order numbers of length 2 at base 3 (0,1,2) are counted', () => {
        const tree = new Array(3);
        Trees.BranchCounter([0, 1], tree, 3);
        Trees.BranchCounter([0, 2], tree, 3);
        Trees.BranchCounter([0, 1], tree, 3);
        Trees.BranchCounter([1, 0], tree, 3);
        expect(tree[0][1]).to.equal(3);
        expect(tree[0][0][0]).to.equal(undefined);
        expect(tree[0][0][1][1]).to.equal(2);
        expect(tree[0][0][2][1]).to.equal(1);
        
        expect(tree[1][1]).to.equal(1);
        expect(tree[1][0][0][1]).to.equal(1);
        expect(tree[1][0][1]).to.equal(undefined);
        expect(tree[1][0][2]).to.equal(undefined);

        expect(tree[2]).to.equal(undefined);
    }),

    it('BranchCounter, given 3 instances of order numbers of length 1 at base 3 (0,1,2) are counted', () => {
        const tree = new Array(3);
        Trees.BranchCounter([0], tree, 3);
        Trees.BranchCounter([0], tree, 3);
        Trees.BranchCounter([1], tree, 3);
        expect(tree[0][1]).to.equal(2);
        expect(tree[1][1]).to.equal(1);
        expect(tree[2]).to.equal(undefined);
    }),
    it('BranchCounterMax, given 4 instances of order numbers of length 2 at base 3 (0,1,2) are counted and correct max is returned', () => {
        const tree = new Array(3);
        Trees.BranchCounter([0, 1], tree, 3);
        Trees.BranchCounter([0, 2], tree, 3);
        Trees.BranchCounter([0, 1], tree, 3);
        Trees.BranchCounter([1, 0], tree, 3);
        Trees.BranchCounter([0, 1], tree, 3);
        const actual = Trees.BranchCounterMax(tree, 3);
        expect([0, 1]).to.eql(actual);
    })
});
    