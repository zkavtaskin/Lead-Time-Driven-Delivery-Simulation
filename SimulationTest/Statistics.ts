import { expect } from 'chai';
import { Statistics } from "../Simulation/Statistics";
import { Probability } from "../Simulation/Probability"

describe('Statistics', () => {
    it('IsNormalDistribution, normal distribution, passes test', () => {
        const actual = Statistics.IsNormalDistribution(0, 0);
        expect(true).to.eql(actual);
    }),
    it('IsNormalDistribution, high skew, normal tail, fails test', () => {
        const actual = Statistics.IsNormalDistribution(2, 0);
        expect(false).to.eql(actual);
    }),
    it('IsNormalDistribution, normal skew, high tail, fails test', () => {
        const actual = Statistics.IsNormalDistribution(0, 2);
        expect(false).to.eql(actual);
    }),
    it('IsNormalDistribution, high skew, high tail, fails test', () => {
        const actual = Statistics.IsNormalDistribution(2, 2);
        expect(false).to.eql(actual);
    }),
    it('FrequencyTest, uniform distribution, 0 < chiSquared < 20', () => {
        const x = Probability.Choice([1, 2, 3, 4, 5, 6], 300);
        const chiSquared = Statistics.FrequencyTest(x, 2);
        expect(20).to.be.greaterThan(chiSquared);
        expect(0).to.be.lessThan(chiSquared);
    }),
    it('FrequencyTest, none uniform distribution, 50 < chiSquared', () => {
        const x =  Probability.Choice([0, 1, 2], 300, [0.1, 0.1, 0.8]);
        const chiSquared = Statistics.FrequencyTest(x, 1);
        expect(50).to.be.lessThan(chiSquared);
    }),
    it('Histogram, 1 value per bin, 3 bins with 1 value', () => {
        const histogram = Statistics.Histogram([1, 2, 3], 1)
        expect(histogram).to.be.eqls([1, 1, 1]);
    }),
    it('Histogram, 1 value per bin with first value being zero, 3 bins with 1 value', () => {
        const histogram = Statistics.Histogram([0, 1, 2], 1)
        expect(histogram).to.be.eqls([1, 1, 1]);
    }),
    it('Histogram, 2 values per bin, 3 bins with 2 values', () => {
        const histogram = Statistics.Histogram([1, 2, 3, 4, 5, 6], 2)
        expect(histogram).to.be.eqls([2, 2, 2]);
    }),
    it('Histogram, odd number of values, 4 bins, 5 bins with correct values', () => {
        const histogram = Statistics.Histogram([1, 2, 3, 4, 5, 6, 7], 2)
        expect(histogram).to.be.eqls([2, 2, 2, 1]);
    }),
    it('Histogram, odd number of values started at zero, 5 bins with correct values', () => {
        const histogram = Statistics.Histogram([0, 1, 2, 3, 4, 5, 6], 2)
        expect(histogram).to.be.eqls([2, 2, 2, 1]);
    }),
    it('Histogram, random numbers with start at zero, 5 bins with correct values', () => {
        const histogram = Statistics.Histogram([0, 3, 2, 5, 2, 6, 1], 2)
        expect(histogram).to.be.eqls([2, 3, 1, 1]);
    })
});