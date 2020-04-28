import { expect } from 'chai';
import { Backlog } from '../Simulation/Backlog';
import { MemberConfig } from '../Simulation/MemberConfig';
import { BacklogConfig } from '../Simulation/BacklogConfig';
import { Story } from '../Simulation/Story';

describe('Backlog', () => {
    it('Generate backlog with 1 story for 1 team member, contains 1 story for 1 team member', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;

        expect(backlog.Length).to.equal(1);
        expect(story1.Tasks.length).to.equal(1);
    }),
    
    it('Generate backlog with 1 story for 1 team member, story has no prerequisite as it is the only story', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;

        expect(story1.HasPrerequisite()).to.equal(false);
    }),

    it('Generate backlog with 2 stories for 1 team member, second story has a dependency on the first, but first not on the second.', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;
        let story2 = iterator.next().value as Story;

        expect(story1.HasPrerequisite()).to.equal(false);
        expect(story2.HasPrerequisite()).to.equal(true);
    }),

    it('Generate backlog with 1 story for 1 team member, story has deadline', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;

        expect(story1.Deadline).to.equal(true);
    }),

    it('Generate backlog with 1 story for 1 team member, task has work', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(1, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);


        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;

        expect(story1.HasWork(0)).to.equal(true);
    }),

    it('Iterator, backlog with 2 stories, 2 stories are returned, third story is undefined', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story1 = iterator.next().value as Story;
        let story2 = iterator.next().value as Story;
        let story3 = iterator.next().value as Story;

        expect(story1.Id).to.equal(0);
        expect(story2.Id).to.equal(1);
        expect(story3).to.equal(undefined);
    }),

    it('Iterator, backlog with 2 stories, 1 story is completed, returns second story next time', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iteratorBeforeComplete = backlog.Iterator();
        let firstStory = iteratorBeforeComplete.next().value as Story;
        firstStory.Contribute(0, firstStory.Tasks[0].Remaining);
        firstStory.Complete(0);

        let iteratorAfterComplete = backlog.Iterator();
        let secondStory = iteratorAfterComplete.next().value as Story;

        expect(secondStory.Id).to.equal(1);
    }),

    it('IsCompleted, backlog with 2 stories, none of the stories are completed, not completed', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        expect(backlog.IsCompleted).to.equal(false);
    }),

    it('IsCompleted, backlog with 2 stories, one of the stories is completed, not completed', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let iterator = backlog.Iterator();
        let story = iterator.next().value as Story;
        story.Contribute(0, story.Tasks[0].Remaining);
        story.Complete(0);

        expect(backlog.IsCompleted).to.equal(false);
    }),

    it('IsCompleted, backlog with 2 stories, two of the stories are completed, completed', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(2, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        for(let story of backlog.Iterator()){
            story.Contribute(0, story.Tasks[0].Remaining);
            story.Complete(0);
        }

        expect(backlog.IsCompleted).to.equal(true);
    }),

    it('Find, backlog with 10 stories, story exists, returns story', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(10, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let story = backlog.Find(5);

        expect(story.Id).to.equal(5);
    }),

    it('Find, backlog with 10 stories, story does not exist, returns undefined', () => {
        let members = [new MemberConfig("PO", 1, 1, 1) ];
        let config = new BacklogConfig(10, 1, 1, 10, 10);
        let backlog =  Backlog.Generate(members, config);

        let story = backlog.Find(11);

        expect(story).to.equal(undefined);
    })
});