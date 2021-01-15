import { expect } from 'chai';
import { Probability } from "../Simulation/Probability";

describe('Probability', () => {
    it('Choice, p is not equals 1, throws error', () => {
        const actual = () => Probability.Choice([1,2,3], 1, [0.2]);
        expect(actual).to.throw();
    }),
    it('Choice, p and arr not same len, throws error', () => {
        const actual = () => Probability.Choice([1,2,3], 1, [0.2, 0.8]);
        expect(actual).to.throw();
    }),
    it('Choice, size 1, returns 1 value', () => {
        const actual = Probability.Choice([1,2,3], 1, [0.2, 0.7, 0.1]);
        expect(actual.length).to.eql(1);
    }),
    it('Choice, size 2, returns 2 values', () => {
        const actual = Probability.Choice([1,2,3], 2, [0.2, 0.7, 0.1]);
        expect(actual.length).to.eql(2);
    }),
    it('Choice, all weight for first value, returns first value', () => {
        const actual = Probability.Choice([1,2,3], 1, [1, 0, 0]);
        expect(actual).to.eql([1]);
    }),
    it('Choice, all weight for last value, returns last value', () => {
        const actual = Probability.Choice([1,2,3], 1, [0, 0, 1]);
        expect(actual).to.eql([3]);
    }),
    it('Choice, all weight for middle value, returns middle value', () => {
        const actual = Probability.Choice([1,2,3], 1, [0, 1, 0]);
        expect(actual).to.eql([2]);
    })
});