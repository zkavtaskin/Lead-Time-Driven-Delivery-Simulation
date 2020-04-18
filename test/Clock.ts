import { expect } from 'chai';
import { Clock } from '../Simulation/Clock';

describe('Clock', () => {
    it('init inteval set to 5, ticks are zero and interval set', () => {
        let clock = new Clock(5);
        expect(clock.IntervalSize).to.equal(5);
        expect(clock.Ticks).to.equal(0);
    }),
    it('Tick invoked number increment by 1', () => {
        let clock = new Clock(0);
        clock.Tick();
        expect(clock.Ticks).to.equal(1);
    })
});