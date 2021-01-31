import { Statistics } from "../Simulation/Statistics"

export class Histogram {
    public readonly Bins : Array<number>;
    public readonly BinRange : number;

    get Uniformity() : number {
        return Statistics.FrequencyTestBin(this.Bins);
    }

    get Last() : [number, number] {
        return [this.Bins.length-1, this.Bins[this.Bins.length-1]];
    }

    get Sum() : number {
        return this.Bins.reduce((sum, bin) => sum + bin, 0);
    }

    get Mean() : number {
        return this.Sum / this.Bins.length;
    }

    constructor(bins : Array<number>, binsRange : number) {
        this.Bins = bins;
        this.BinRange = binsRange;
    }
}