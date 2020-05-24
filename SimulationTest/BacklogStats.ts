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
        let leadTimeExpected = new Summary(3, 132, 2, 120, 44, 10, 53.8);
        let cycleTimeExpected = new Summary(3, 26, 1, 20, 8.7, 5, 8.2);

        expect(actual.LeadTime).to.eql(leadTimeExpected);
        expect(actual.CycleTime).to.eql(cycleTimeExpected);
    }),
    it('Three tasks for single team member with high, mid and low, Team Members Original and Actual matches expectation', () => {
        let storyOne = new Story(0, false, null, new Array<Task>(new Task(1)));
        storyOne.AddWork(0, 1);
        let storyTwo = new Story(1, false, null, new Array<Task>(new Task(5)));
        let storyThree = new Story(2, false, null, new Array<Task>(new Task(10)));

        let actual = new BacklogStats(new Array<Story>(storyOne, storyTwo, storyThree));
        let originalExpected = new Summary(3, 16, 1, 10, 5.3, 5, 3.7);
        let actualExpected = new Summary(3, 17, 2, 10, 5.7, 5, 3.3);

        expect(actual.TeamMembersOriginal[0]).to.eql(originalExpected);
        expect(actual.TeamMembersActual[0]).to.eql(actualExpected);
    }),

    it('Null hypothesis, numbers are with in the same mean range, returns null', () => {
        let actual = BacklogStats.GetSignificance(4.2, 2.89, 21, 4.8)
        expect(actual).to.equal(null);
    }),
    it('Positive significance, numbers are not in the same mean range, retuns true', () => {
        let actual = BacklogStats.GetSignificance(15.5, 3.02, 11, 5.5)
        expect(actual).to.equal(true);
    }),
    it('Negative significance, numbers are not in the same mean range, retuns false', () => {
        let actual = BacklogStats.GetSignificance(5.5, 3.02, 11, 15.5)
        expect(actual).to.equal(false);
    });
});