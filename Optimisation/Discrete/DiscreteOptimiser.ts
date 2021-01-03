import { DiscreteSearchResult } from "./DiscreteSearchResult";

export interface DiscreteOptimiser {
    Search: () => DiscreteSearchResult;
}