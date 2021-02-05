import { Statistics } from "../Simulation/Statistics"

export class Histogram {
    public readonly Bins : Array<number>;
    public readonly BinRange : number;

    get Uniformity() : number {
        return Statistics.toDecimalPlace(Statistics.FrequencyTestBin(this.Bins), 2);
    }

    get Last() : [number, number] {
        return [this.Bins.length-1, this.Bins[this.Bins.length-1]];
    }

    get Sum() : number {
        return this.Bins.reduce((sum, bin) => sum + bin, 0);
    }

    get Median() : [number, number] {
        const half = this.Sum / 2;
        let sum = 0;
        for(let i = 0; i < this.Bins.length; i++) {
            sum += this.Bins[i];
            if(sum >= half) {
                return [i, this.Bins[i]]; 
            }
        }
    }

    constructor(bins : Array<number>, binsRange : number) {
        this.Bins = bins;
        this.BinRange = binsRange;
    }
}