
export class Statistics {
    /***
     * @description Kurtosis & Skew explanation: https://www.spcforexcel.com/knowledge/basic-statistics/are-skewness-and-kurtosis-useful-statistics**
     * @param kurtosis Kurtosis - "Kurtosis tells you virtually nothing about the shape of the peak – its only unambiguous interpretation is in terms of tail extremity."
     *  The following heuristics will be used: {0..0.5=Normal tail,>1=Not enough tail,-0.3..0=Moderate tail,..<-0.3=Heavy tail}
     * @param skew Skew - "Skewness is usually described as a measure of a dataset’s symmetry – or lack of symmetry.   
     * A perfectly symmetrical data set will have a skewness of 0. The normal distribution has a skewness of 0."
     * The following heuristics will be used: {-0.5..0.5=Normal Skew,-1..-0.5 OR ,0.5..1=Moderate Skew,..<-1 OR >1 =High Skew}
     */
    public static IsNormalDistribution(kurtosis : number, skew : number) : boolean {
        const normalTail = kurtosis <= 0.5 && kurtosis >= -0.3;
        const normalSkew = skew <= 1 && skew >= -1;
        return normalSkew && normalTail;
    }

    /***
     * @description Uniform Distribution test using Chi-Squared test
     * Explanation: https://www.eg.bucknell.edu/~xmeng/Course/CS6337/Note/master/node43.html#:~:text=The%20frequency%20test%20is%20a,and%20the%20theoretical%20uniform%20distribution.
     * @param X list of numbers to evaluate 
     * @param binRange range of numbers that will be placed inside the bin
     * @returns chiSquared
     */
    public static FrequencyTest(X : Array<number>, binRange : number) : number {
        const bins = this.Histogram(X, binRange);
        const expected = X.length / bins.length;
        const chiSquared = bins.reduce((sum, observation) => sum + (observation-expected)**2 / expected, 0);
        return chiSquared;
    }

    public static Histogram(X : Array<number>, binRange : number) : Array<number> {
        //inclusive of the first number  
        const max = Math.max(...X);
        const min = Math.min(...X);
        const len = max - min + 1;
        const numberOfBins = Math.ceil(len / binRange);
        const bins = new Array(numberOfBins).fill(0);
        //-min to normalise values for the array
        X.forEach((x) => bins[Math.floor((x-min) / binRange)]++);
        return bins;
    }
}
