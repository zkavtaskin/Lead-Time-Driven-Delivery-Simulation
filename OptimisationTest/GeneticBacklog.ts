import { expect } from 'chai';
import * as genetic from "charles.darwin"

describe('GeneticBacklog', () => {
    it('Test', () => {
        let test = new genetic.Darwin<number>({
            population_size: 100,
            chromosome_length: 20,
            rand_gene: (() => {
                return 1;
            })
        });
        
        expect(1).to.equal(1);
    })
});
