
export class Result {
    public readonly BestScore : number;
    public readonly BestEncoding : Array<number>
    public readonly AverageScore : number;

    constructor(bestScore : number, bestEncoding : Array<number>, averageScore : number) {
        this.BestScore = bestScore;
        this.BestEncoding = bestEncoding;
        this.AverageScore = averageScore;
    }
}