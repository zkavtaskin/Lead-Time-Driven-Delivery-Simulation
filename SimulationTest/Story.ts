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
        expect(story.Activate(1, 0)).to.equal(false);
    }),
    it('Activate, this is the first time story is picked up, story is activated', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2)));
        expect(story.Activate(0, 0)).to.equal(true);
    }),
    it('Activate, secod time story is picked up, story is not re-activated', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(2), new Task(5)));
        expect(story.Activate(0, 0)).to.equal(true);
        expect(story.Activate(1, 1)).to.equal(false);
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
    }),

    it('SizeOriginal, new story, there are no tasks, returns 0', () => {
        let story = new Story(1, false, 2, new Array<Task>());
        expect(story.SizeOriginal).to.equal(0);
    }), 

    it('SizeOriginal, new story, there are 2 tasks, returns 5', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(3), new Task(2)));
        expect(story.SizeOriginal).to.equal(5);
    }), 

    it('Contribute, no such team member, throw an error', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(10)));
        expect(() => story.Contribute(1, 5)).to.throw();
    }),
    it('Contribute, remaining effort is greater then effort contributed, returns zero', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(10)));
        expect(story.Contribute(0, 1)).to.equal(0);
    }),
    it('Contribute, remaining effort is same as effort contributed, returns zero', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(10)));
        expect(story.Contribute(0, 10)).to.equal(0);
    }),
    it('Contribute, remaining effort is less then  effort contributed, returns remainder', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(10)));
        expect(story.Contribute(0, 20)).to.equal(10);
    }),


    it('AddWork, no such team member, throw an error', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(10)));
        expect(() => story.AddWork(2, 2)).to.throw();
    }),
    it('AddWork, added one hours, remaining and actual are updated with extra hour, original will remain the same', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(1)));
        let task = story.AddWork(0, 1);
        expect(task.Remaining).to.equal(2);
        expect(task.Actual).to.equal(2);
        expect(task.Original).to.equal(1);
    }),

    it('CycleTime, story not started not completed, returns null', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(1)));
        expect(story.CycleTime).to.equal(null);
    }),
    it('CycleTime, story started but not completed, returns null', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(1)));
        story.Activate(0, 0);
        expect(story.CycleTime).to.equal(null);
    }),
    it('CycleTime, story started and completed, it took 2 ticks', () => {
        let story = new Story(1, false, 2, new Array<Task>(new Task(0)));
        story.Activate(0, 0);
        story.Complete(2);
        expect(story.CycleTime).to.equal(2);
    }),

    it('Copy, copies story, tasks and properties are set correctly', () => {
        const storyOriginal = new Story(1, false, 2, new Array<Task>(new Task(1), null, new Task(2)));
        const storyCopy = storyOriginal.Copy();
        expect(storyOriginal.Id).to.equal(storyCopy.Id);
        expect(storyOriginal.PrerequisiteId).to.equal(storyCopy.PrerequisiteId);
        expect(storyOriginal.Deadline).to.equal(storyCopy.Deadline);
        expect(storyOriginal.Tasks[0].Original).to.equal(storyCopy.Tasks[0].Original);
        expect(storyOriginal.Tasks[1]).to.equal(storyCopy.Tasks[1]);
        expect(storyOriginal.Tasks[2].Original).to.equal(storyCopy.Tasks[2].Original);
    })

});