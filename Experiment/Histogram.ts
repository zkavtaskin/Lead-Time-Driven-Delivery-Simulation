import { Statistics } from "../Simulation/Statistics"

export class Histogram {
    public readonly Bins : Array<number>;
    public readonly BinRange : number;

    get Uniformity() : number {
        return Statistics.ToDecimalPlace(Statistics.FrequencyTestBin(this.Bins), 2);
    }

    get Max() : [number, number] {
        return [this.Bins.length-1, this.Bins[this.Bins.length-1]];
    }

    get Sum() : number {
        return this.Bins.reduce((sum, bin) => sum + bin, 0);
    }

    get Quartiles() : [number, number, number] {
        const sum = this.Sum;

        const q1  = sum * (1/4),
              q2  = sum * (2/4),
              q3  = sum * (3/4);

        let rollingSum = 0, 
            q1Index = null, 
            q2Index = null, 
            q3Index = null;

        for(let i = 0; i < this.Bins.length && (q1Index == null || q2Index == null || q3Index == null); i++) {
            rollingSum += this.Bins[i];
            if(rollingSum >= q1 && q1Index == null) {
                q1Index = i;
            } else if(rollingSum >= q2 && q2Index == null) {
                q2Index = i;
            } else if(rollingSum >= q3 && q3Index == null) {
                q3Index = i;
            }
        }
        return [q1Index, q2Index, q3Index];
    }

    constructor(bins : Array<number>, binsRange : number) {
        this.Bins = bins;
        this.BinRange = binsRange;
    }
}