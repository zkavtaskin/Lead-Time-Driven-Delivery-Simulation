import { expect } from 'chai';
import { Statistics } from "../Simulation/Statistics";

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
        const x = Statistics.Choice([1, 2, 3, 4, 5, 6], 300);
        const chiSquared = Statistics.FrequencyTest(x, 2);
        expect(20).to.be.greaterThan(chiSquared);
        expect(0).to.be.lessThan(chiSquared);
    }),
    it('FrequencyTest, none uniform distribution, 50 < chiSquared', () => {
        const x =  Statistics.Choice([0, 1, 2], 300, [0.1, 0.1, 0.8]);
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
    }),
    it('Histogram, numbers start at 5 end at 10, 3 bins with correct values', () => {
        const histogram = Statistics.Histogram([5, 5, 6, 6, 7, 8, 9, 10], 2)
        expect(histogram).to.be.eqls([4, 2, 2]);
    }),
    it('HistogramSum, 2 diverse histograms to be summed up', () => {
        const histogramNotFull = [0, 12]
        const histogramFull = [1,2,3,4,5];
        const actual = Statistics.HistogramSum([histogramNotFull, histogramFull]);
        expect([1, 14, 3, 4, 5]).to.be.eqls(actual);
    }),
    it('Choice, p is not equals 1, throws error', () => {
        const actual = () => Statistics.Choice([1,2,3], 1, [0.2]);
        expect(actual).to.throw();
    }),
    it('Choice, p contains negative value, throws error', () => {
        const actual = () => Statistics.Choice([1,2,3], 1, [0.2, -0.2, 1]);
        expect(actual).to.throw();
    }),
    it('Choice, p is greater then 1, throws error', () => {
        const actual = () => Statistics.Choice([1,2,3], 1, [0.2, 0.7, 0.2]);
        expect(actual).to.throw();
    }),
    it('Choice, p and arr not same len, throws error', () => {
        const actual = () => Statistics.Choice([1,2,3], 1, [0.2, 0.8]);
        expect(actual).to.throw();
    }),
    it('Choice, size 1, returns 1 value', () => {
        const actual = Statistics.Choice([1,2,3], 1, [0.2, 0.7, 0.1]);
        expect(actual.length).to.eql(1);
    }),
    it('Choice, size 2, returns 2 values', () => {
        const actual = Statistics.Choice([1,2,3], 2, [0.2, 0.7, 0.1]);
        expect(actual.length).to.eql(2);
    }),
    it('Choice, all weight for first value, returns first value', () => {
        const actual = Statistics.Choice([1,2,3], 1, [1, 0, 0]);
        expect(actual).to.eql([1]);
    }),
    it('Choice, all weight for last value, returns last value', () => {
        const actual = Statistics.Choice([1,2,3], 1, [0, 0, 1]);
        expect(actual).to.eql([3]);
    }),
    it('Choice, all weight for middle value, returns middle value', () => {
        const actual = Statistics.Choice([1,2,3], 1, [0, 1, 0]);
        expect(actual).to.eql([2]);
    }),
    it('MoodsMedianTest, null hypothesis not rejected, returns true', () => {
        const sampleA = [1, 14, 19, 12, 11, 15, 20, 5, 21, 15, 15, 28, 3, 6];
        const sampleB = [16, 17, 19, 10, 31, 22, 26, 24, 27, 32, 14, 8, 12, 11];
        const actual = Statistics.MoodsMedianTest(sampleA, sampleB);
        expect(actual).to.eql(true);
    }),
    it('Quartiles, null hypothesis not rejected, returns false', () => {
        const sampleA = [1, 14, 19, 12, 11, 15, 20, 5, 21, 15, 15, 28, 3, 6];
        const actual = Statistics.Quartiles(sampleA);
        expect(actual).to.eql([5.5, 14, 17]);
    })
});