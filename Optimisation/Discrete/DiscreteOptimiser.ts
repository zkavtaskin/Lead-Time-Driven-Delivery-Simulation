import { DiscreteSearchResult } from "./DiscreteSearchResult";

export interface DiscreteOptimiser {
    ObjectiveFunctions:Array<string>;
    Search: (objectiveFunction:string) => DiscreteSearchResult;
}