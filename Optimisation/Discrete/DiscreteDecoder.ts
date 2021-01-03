
export interface DiscreteDecoder {
    Decode(combination : Array<number>) : Function
    DecodeReadable(combination : Array<number>) : Array<string>
    Base:number;
}