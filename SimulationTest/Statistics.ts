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

    it('FrequencyTest, uniform distribution, 0 < chiSquared < 4', () => {
        const x = [];
        for(let i=0; i < 300; i++) {
           x.push(Math.floor(Math.random() * 6));
        }
        const chiSquared = Statistics.FrequencyTest(x, 2);
        expect(4).to.be.greaterThan(chiSquared);
        expect(0).to.be.lessThan(chiSquared);
    }),


    it('FrequencyTest, none uniform distribution, 50 < chiSquared', () => {
        const x = [];
        for(let i=0; i < 300; i++) {
            const bin = Math.floor(Math.random() * 10);
            if(bin >= 1 && bin <= 7) {
                x.push(1);
            }
            else if (bin >= 8 && bin <= 9) {
                x.push(2);
            }
            else if(bin == 0) {
                x.push(0);
            }
        }
        const chiSquared = Statistics.FrequencyTest(x, 1);
        expect(50).to.be.lessThan(chiSquared);
    })
});