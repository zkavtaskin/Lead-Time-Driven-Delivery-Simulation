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

    it('HasPrerequisite, there is no prerequisite, false', () => {
        let story = new Story(1, false, null, new Array<Task>());
        expect(story.HasPrerequisite()).to.equal(false);
    }),
    it('HasPrerequisite, there is prerequisite, true', () => {
        let story = new Story(1, false, 2, new Array<Task>());
        expect(story.HasPrerequisite()).to.equal(true);
    }),

    it('IsCompleted, is completed at zero ticks, true', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(0)));
        story.Complete(0);
        expect(story.IsCompleted()).to.equal(true);
    }),
    it('IsCompleted, is not completed, false', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(0)));
        expect(story.IsCompleted()).to.equal(false);
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
    }),

    it('Complete, tasks are not at zero, false', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(1)));
        expect(story.Complete(0)).to.equal(false);
    }),
    it('Complete, tasks are  at zero, true', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(0)));
        expect(story.Complete(0)).to.equal(true);
    }),
    it('Complete, story is already completed, does not complete again', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(0)));
        story.Complete(0);
        expect(story.Complete(1)).to.equal(false);
    })

});