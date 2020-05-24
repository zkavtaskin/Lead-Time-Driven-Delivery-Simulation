import { expect } from 'chai';
import { TeamConfig } from "../Simulation/TeamConfig";
import { GeneticDecoderBacklog } from "../Optimisation/GeneticDecoderBacklog";
import { MemberConfig } from '../Simulation/MemberConfig';

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
    })
});
    