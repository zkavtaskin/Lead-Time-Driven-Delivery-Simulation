
export class DiscreteSearchResult {
    public readonly Score : number;
    public readonly Encoding : Array<number>
    public readonly EncodingDecoded : Array<string>

    constructor(score : number, encoding : Array<number>, encodingDecoded : Array<string>) {
        this.Score = score;
        this.Encoding = encoding;
        this.EncodingDecoded = encodingDecoded;
    }
}