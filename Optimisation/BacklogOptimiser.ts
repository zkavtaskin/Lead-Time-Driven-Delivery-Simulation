import { SearchResult } from "./SearchResult";

export interface BacklogOptimiser {
    Search: () => SearchResult;
}