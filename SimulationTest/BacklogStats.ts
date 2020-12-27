import { expect } from 'chai';
import { Story } from "../Simulation/Story";
import { BacklogStats } from "../Simulation/BacklogStats";
import { Summary } from "../Simulation/BacklogStats";
import { Task } from '../Simulation/Task';

describe('BacklogStats', () => {
    it('null, throws', () => {
        expect(() => new BacklogStats(null)).to.throw();
    }),
    it('no stories, throws', () => {
        expect(() => new BacklogStats(new Array<Story>())).to.throw();
    }),
    it('story with no tasks, throws', () => {
        let story = new Story(0, false, null, new Array<Task>());
        expect(() => new BacklogStats(new Array<Story>(story))).to.throw();
    }),
    it('Four stories with high, mid, mid and low, Lead Time and Cycle Time matches expectation', () => {
        
        let storyOne = new Story(0, false, null, new Array<Task>(new Task(0)));
        storyOne.Activate(0, 1);
        storyOne.Complete(2);
        
        let storyTwo = new Story(1, false, null, new Array<Task>(new Task(0)));
        storyTwo.Activate(0, 5);
        storyTwo.Complete(10);
    
        let storyThree = new Story(1, false, null, new Array<Task>(new Task(0)));
        storyThree.Activate(0, 5);
        storyThree.Complete(10);

        let storyFour = new Story(25, false, null, new Array<Task>(new Task(0)));
        storyFour.Activate(0, 100);
        storyFour.Complete(120);

        let actual = new BacklogStats(new Array<Story>(storyOne, storyTwo, storyThree, storyFour));
        let leadTimeExpected = new Summary(4, 142, 2, 120, 35.5, 10, 48.9, 2390.8, 2, 3.9);
        let cycleTimeExpected = new Summary(4, 31, 1, 20, 7.8, 5, 7.3, 52.7, 1.7, 3.2);

        expect(actual.LeadTime).to.eql(leadTimeExpected);
        expect(actual.CycleTime).to.eql(cycleTimeExpected);
    }),

    it('Four stories done at the same cycle time, Lead Time and Cycle Time matches expectation', () => {
        
        let storyOne = new Story(0, false, null, new Array<Task>(new Task(0)));
        storyOne.Activate(0, 0);
        storyOne.Complete(5);
        
        let storyTwo = new Story(1, false, null, new Array<Task>(new Task(0)));
        storyTwo.Activate(0, 5);
        storyTwo.Complete(10);

        let storyThree = new Story(3, false, null, new Array<Task>(new Task(0)));
        storyThree.Activate(0, 10);
        storyThree.Complete(15);

        let storyFour = new Story(4, false, null, new Array<Task>(new Task(0)));
        storyFour.Activate(0, 15);
        storyFour.Complete(20);

        let actual = new BacklogStats(new Array<Story>(storyOne, storyTwo, storyThree, storyFour));
        let leadTimeExpected = new Summary(4, 50, 5, 20, 12.5, 12.5, 5.6, 31.3, 0, -1.2);
        let cycleTimeExpected = new Summary(4, 20, 5, 5, 5, 5, 0, 0, NaN, NaN);

        expect(actual.LeadTime).to.eql(leadTimeExpected);
        expect(actual.CycleTime).to.eql(cycleTimeExpected);
    }),


    it('TwoSampleTest, summary A is less then 30, thows an error', () => {

        const a = new Summary(15, null, null, null, null, null, null, null);
        const b = new Summary(50, null, null, null, null, null, null, null);

        expect(() => BacklogStats.TwoSampleTest(a, b, 0.05)).to.throw();
    }),

    it('TwoSampleTest, summary B is less then 30, thows an error', () => {

        const a = new Summary(30, null, null, null, null, null, null, null);
        const b = new Summary(15, null, null, null, null, null, null, null);

        expect(() => BacklogStats.TwoSampleTest(a, b, 0.05)).to.throw();
    }),

    it('TwoSampleTest, summary A and B is less then 30, thows an error', () => {

        const a = new Summary(15, null, null, null, null, null, null, null);
        const b = new Summary(15, null, null, null, null, null, null, null);

        expect(() => BacklogStats.TwoSampleTest(a, b, 0.05)).to.throw();
    }),

    it('TwoSampleTest, numbers are not  with in same range, hypothesis of equal means is negatively rejected, returns false', () => {

        const a = new Summary(75, null, null, null, 28, null, null, Math.pow(14.1, 2));
        const b = new Summary(50, null, null, null, 33, null, null, Math.pow(9.5, 2));

        let actual = BacklogStats.TwoSampleTest(a, b, 0.05);
        expect(actual).to.equal(false);
    }),

    it('TwoSampleTest, numbers are not  with in same range, hypothesis of equal means is positively rejected, returns true', () => {

        const a = new Summary(50, null, null, null, 33, null, null, Math.pow(9.5, 2));
        const b = new Summary(75, null, null, null, 28, null, null, Math.pow(14.1, 2));

        let actual = BacklogStats.TwoSampleTest(a, b, 0.05);
        expect(actual).to.equal(true);
    }),

    it('TwoSampleTest, numbers are in the same range, hypothesis of equal means is accepted, returns null', () => {

        const a = new Summary(32, null, null, null, 4.7, null, null, 7.24);
        const b = new Summary(30, null, null, null, 4.8, null, null, 9.33);

        let actual = BacklogStats.TwoSampleTest(a, b, 0.05);
        expect(actual).to.equal(null);
    })
});