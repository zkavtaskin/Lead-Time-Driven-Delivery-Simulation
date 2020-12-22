import { SearchResult } from "./SearchResult";
import { Story } from "../Simulation/Story"

export interface BacklogDecoder {
    Decode(pattern : Array<number>) : (a : Story, b : Story) => number
    DecodeReadable(pattern : Array<number>) : Array<string>
    Base:number;
}