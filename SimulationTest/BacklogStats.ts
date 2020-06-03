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
    it('Three stories with high, mid and low, Lead Time and Cycle Time matches expectation', () => {
        
        let storyOne = new Story(0, false, null, new Array<Task>(new Task(0)));
        storyOne.Activate(0, 1);
        storyOne.Complete(2);
        
        let storyTwo = new Story(1, false, null, new Array<Task>(new Task(0)));
        storyTwo.Activate(0, 5);
        storyTwo.Complete(10);

        let storyThree = new Story(25, false, null, new Array<Task>(new Task(0)));
        storyThree.Activate(0, 100);
        storyThree.Complete(120);

        let actual = new BacklogStats(new Array<Story>(storyOne, storyTwo, storyThree));
        let leadTimeExpected = new Summary(3, 132, 2, 120, 44, 10, 53.8, 2898.7);
        let cycleTimeExpected = new Summary(3, 26, 1, 20, 8.7, 5, 8.2, 66.9);

        expect(actual.LeadTime).to.eql(leadTimeExpected);
        expect(actual.CycleTime).to.eql(cycleTimeExpected);
    }),
    it('Three tasks for single team member with high, mid and low, Team Members Original and Actual matches expectation', () => {
        let storyOne = new Story(0, false, null, new Array<Task>(new Task(1)));
        storyOne.AddWork(0, 1);
        let storyTwo = new Story(1, false, null, new Array<Task>(new Task(5)));
        let storyThree = new Story(2, false, null, new Array<Task>(new Task(10)));

        let actual = new BacklogStats(new Array<Story>(storyOne, storyTwo, storyThree));
        let originalExpected = new Summary(3, 16, 1, 10, 5.3, 5, 3.7, 13.6);
        let actualExpected = new Summary(3, 17, 2, 10, 5.7, 5, 3.3, 10.9);

        expect(actual.TeamMembersOriginal[0]).to.eql(originalExpected);
        expect(actual.TeamMembersActual[0]).to.eql(actualExpected);
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