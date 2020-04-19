import { expect } from 'chai';
import { Story } from '../Simulation/Story';
import { Task } from '../Simulation/Task';
import { Clock } from '../Simulation/Clock';

describe('Story', () => {
    it('init params are passed, they are all set correctly', () => {
        let story = new Story(1, false, 2, new Array<Task>());

        expect(story.Id).to.equal(1);
        expect(story.PrerequisiteId).to.equal(2);
        expect(story.HasPrerequisite()).to.equal(true);
        expect(story.Deadline).to.equal(false);
        expect(story.Tasks.length).to.equal(0);
    }),
    it('HasWork, no task for team member, there is no work', () => {
        let story = new Story(1, false, 2, new Array<Task>());
        expect(story.HasWork(0)).to.equal(false);
    }),
    it('HasWork, there is work for team member, there is work', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2)));
        expect(story.HasWork(0)).to.equal(true);
    }),
    it('Activate, there is no such team member, does not activate', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2)));
        story.Activate(1, new Clock(0));
        expect(story.StartedTick).to.equal(null);
    }),
    it('Activate, this is the first time story is picked up, story is activated', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2)));
        story.Activate(0, new Clock(0));
        expect(story.StartedTick).to.equal(0);
    }),
    it('Activate, secod time story is picked up, story is not re-activated', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2), new Task(5)));
        let clock = new Clock(0);
        story.Activate(0, clock);
        clock.Tick();
        story.Activate(1, clock);
        expect(story.StartedTick).to.equal(0);
    })
});