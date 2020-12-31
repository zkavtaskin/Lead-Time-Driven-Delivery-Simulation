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

        let actual = new BacklogRuntimeMetrics(new Array<Story>(storyOne, storyTwo, storyThree, storyFour));
        let leadTimeExpected : StatisticsDescriptive = { 
            Mean :35.5,
            Median : 10,
            Std : 48.9,
            Min : 2,
            Max : 120,
            Skew : 2,
            Kurtosis: 3.9,
            Variance : 2390.8,
            Count :4,
            Sum   :142,
            Frequency : 3.5
        };
            
        let cycleTimeExpected : StatisticsDescriptive  = {
            Mean :7.8,
            Median : 5,
            Std : 7.3,
            Min : 1,
            Max : 20,
            Skew : 1.7,
            Kurtosis: 3.2,
            Variance : 52.7,
            Count :4,
            Sum   :31,
            Frequency : 4
        }

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

        let actual = new BacklogRuntimeMetrics(new Array<Story>(storyOne, storyTwo, storyThree, storyFour));

        let leadTimeExpected : StatisticsDescriptive = { 
            Mean :12.5,
            Median : 12.5,
            Std : 5.6,
            Min : 5,
            Max : 20,
            Skew : 0,
            Kurtosis: -1.2,
            Variance : 31.3,
            Count :4,
            Sum   :50,
            Frequency : 4
        };
            
        let cycleTimeExpected : StatisticsDescriptive  = {
            Mean :5,
            Median : 5,
            Std : 0,
            Min : 5,
            Max : 5,
            Skew : NaN,
            Kurtosis: NaN,
            Variance : 0,
            Count :4,
            Sum   :20,
            Frequency : 4
        }

        expect(actual.LeadTime).to.eql(leadTimeExpected);
        expect(actual.CycleTime).to.eql(cycleTimeExpected);
    })

});