import { expect } from 'chai';
import { TeamConfig } from "../Simulation/TeamConfig";
import { GeneticDecoderBacklog } from "../Optimisation/GeneticDecoderBacklog";
import { MemberConfig } from '../Simulation/MemberConfig';
import { Story } from '../Simulation/Story';
import { Task } from '../Simulation/Task';

describe('GeneticDecoderBacklog', () => {
    it('Init, given 2 team members and 1 field (PrerequisiteId), 3 will be used for optimisation and chromosome length is 3', () => {
        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)], null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        expect(decoder.ChromoLen).to.equal(teamConfig.Members.length + 1);
    }),

    it('GetRandom, chromosome length is 6, random gene sequence is issued that is 6^2 length and one of the heads is active', () => {
        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)],  null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        const geneLen = decoder.GetRandom();
        const chromosActive = geneLen.reduce((accumulator, currentValue, currentIndex) => { 
            if(currentIndex % decoder.ChromoLen == 0 && currentValue == 1) 
                return ++accumulator;

            return accumulator;
        });
        expect(geneLen.length).to.equal(36);
        expect(chromosActive).to.be.gt(0);
    }),

    it('Decode, stories have dependency, gene is set to prioritise prerequisiteId only', () => {

        const storyA = new Story(0, false, null, Array<Task>(new Task(0), new Task(0)));
        const storyB = new Story(1, false, 0, Array<Task>(new Task(0), new Task(0)));
        const storyC = new Story(2, false, null, Array<Task>(new Task(0), new Task(0)));
        const stories = new Array<Story>(storyA, storyB, storyC);

        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)],  null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        const lambda = decoder.Decode([1, 0, 0, 0, 0, 0, 0, 0, 0]);
        const actual = stories.sort(lambda).map(story => story.Id);
        const expected = [0, 2, 1];
        expect(actual).to.eql(expected)
    }),

    it('Decode, stories have dependencies, gene is set to prioritise prerequisiteId only', () => {

        const storyA = new Story(0, false, null, Array<Task>(new Task(0), new Task(0)));
        const storyB = new Story(1, false, null, Array<Task>(new Task(0), new Task(0)));
        const storyC = new Story(2, false, 1, Array<Task>(new Task(0), new Task(0)));
        const storyD = new Story(3, false, 0, Array<Task>(new Task(0), new Task(0)));
        const storyE = new Story(4, false, null, Array<Task>(new Task(0), new Task(0)));
        const storyF = new Story(5, false, 2, Array<Task>(new Task(0), new Task(0)));
        const stories = new Array<Story>(storyA, storyB, storyC, storyD, storyE, storyF);

        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)],  null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        const lambda = decoder.Decode([1, 0, 0, 0, 0, 0, 0, 0, 0]);
        const actual = stories.sort(lambda).map(story => story.Id);
        const expected = [0, 1, 4, 3, 2, 5];
        expect(actual).to.eql(expected)
    }),

    it('Decode, stories are delivered by 2 team members, gene is set to prioritise by single team member only i.e. in reverse', () => {

        const storyA = new Story(0, false, null, Array<Task>(new Task(7), new Task(0)));
        const storyB = new Story(1, false, null, Array<Task>(new Task(6), new Task(0)));
        const storyC = new Story(2, false, null, Array<Task>(new Task(5), new Task(0)));
        const storyD = new Story(3, false, null, Array<Task>(new Task(4), new Task(0)));
        const storyE = new Story(4, false, null, Array<Task>(new Task(3), new Task(0)));
        const storyF = new Story(5, false, null, Array<Task>(new Task(2), new Task(0)));
        const stories = new Array<Story>(storyA, storyB, storyC, storyD, storyE, storyF);

        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)],  null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        const lambda = decoder.Decode([0, 0, 0, 1, 0, 0, 0, 0, 0]);
        const actual = stories.sort(lambda).map(story => story.Id);
        const expected = [5, 4, 3, 2, 1, 0];
        expect(actual).to.eql(expected)
    }),

    it('Decode, stories have dependencies, gene is set to prioritise by prerequisiteId first and then single team member', () => {

        const storyA = new Story(0, false, null, Array<Task>(new Task(1), new Task(0)));
        const storyB = new Story(1, false, null, Array<Task>(new Task(4), new Task(0)));
        const storyC = new Story(2, false, 1, Array<Task>(new Task(5), new Task(0)));
        const storyD = new Story(3, false, 0, Array<Task>(new Task(4), new Task(0)));
        const storyE = new Story(4, false, null, Array<Task>(new Task(7), new Task(0)));
        const storyF = new Story(5, false, 2, Array<Task>(new Task(2), new Task(0)));
        const stories = new Array<Story>(storyA, storyB, storyC, storyD, storyE, storyF);

        const teamConfig = new TeamConfig([new MemberConfig("", 1, 1, 1), new MemberConfig("", 1, 1, 1)],  null);
        const decoder = new GeneticDecoderBacklog(teamConfig);
        const lambda = decoder.Decode([1, 0, 0, 1, 1, 0, 0, 0, 0]);
        const actual = stories.sort(lambda).map(story => story.Id);
        const expected = [0, 1, 4, 3, 2, 5];
        expect(actual).to.eql(expected)
    })

});
    