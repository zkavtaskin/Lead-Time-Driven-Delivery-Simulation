import { Result } from "./Result";

export interface BacklogOptimiser {
    Solve: () => Result;
}