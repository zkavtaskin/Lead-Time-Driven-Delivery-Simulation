import { expect } from 'chai';
import { Task } from '../Simulation/Task';

describe('Task', () => {
    it('init interval set to 1, all props are set to 1', () => {
        let task = new Task(1);
        expect(task.Actual).to.equal(1);
        expect(task.Remaining).to.equal(1);
        expect(task.Original).to.equal(1);
    })
});