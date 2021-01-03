
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
     * @param x list of numbers to evaluate 
     * @param binRange range of numbers that will be placed inside the bin
     * @returns chiSquared
     */
    public static FrequencyTest(x : Array<number>, binRange : number) : number {
        //inclusive of the first number  
        const len = Math.max(...x) - Math.min(...x) + 1;
        const numberOfIntervals = Math.ceil(len / binRange);
        const expected = x.length / numberOfIntervals;
        const observationsPerInterval = new Array(numberOfIntervals).fill(0);
        x.forEach((number) => observationsPerInterval[Math.floor(number / binRange)]++);
        const chiSquared = observationsPerInterval.reduce((sum, observation) => sum + (observation-expected)**2 / expected, 0);
        return chiSquared;
    }
}
