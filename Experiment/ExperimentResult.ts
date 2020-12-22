export class ExperimentResult {
    public readonly BestScore : number;
    public readonly BestEncoding : Array<number>
    public readonly BestEncodingDecoded : Array<string>

    constructor(bestScore : number, bestEncoding : Array<number>, bestEncodingDecoded : Array<string>) {
        this.BestScore = bestScore;
        this.BestEncoding = bestEncoding;
        this.BestEncodingDecoded = bestEncodingDecoded;
    }
}