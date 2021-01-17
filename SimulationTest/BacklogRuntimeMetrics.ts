import { expect } from 'chai';
import { Story } from "../Simulation/Story";
import { BacklogRuntimeMetrics } from "../Simulation/BacklogRuntimeMetrics";
import { StatisticsDescriptive } from "../Simulation/StatisticsDescriptive";
import { Task } from '../Simulation/Task';

describe('BacklogRuntimeMetrics', () => {
    it('null, throws', () => {
        expect(() => new BacklogRuntimeMetrics(null)).to.throw();
    }),
    it('no stories, throws', () => {
        expect(() => new BacklogRuntimeMetrics(new Array<Story>())).to.throw();
    }),
    it('story with no tasks, throws', () => {
        let story = new Story(0, false, null, new Array<Task>());
        expect(() => new BacklogRuntimeMetrics(new Array<Story>(story))).to.throw();
    })

});