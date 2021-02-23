import * as simplestats from 'simple-statistics'
import { StatisticsDescriptive } from './StatisticsDescriptive';

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
        return this.FrequencyTestBin(bins);
    }

    public static FrequencyTestBin(bins : Array<number>) : number {
        const sum = bins.reduce((sum, bin) => sum + bin, 0);
        const expected = sum / bins.length;
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

    public static Choice(events: Array<number>, size : number, probability : Array<number> = null) : Array<number> {
        if(probability != null) {
          const pSum = probability.reduce((sum, v) => sum + v);
          if(pSum < 1 - Number.EPSILON || pSum > 1 + Number.EPSILON) {
            throw Error("Overall probability has to be 1.");
          }
          if(probability.find((p) => p < 0) != undefined) {
            throw Error("Probability can not contain negative values");
          }
          if(events.length != probability.length) {
            throw Error("Events have to be same length as probability");
          }
        } else {
          probability = new Array(events.length).fill(1/events.length);
        }
    
        const probabilityRanges = probability.reduce((ranges, v, i) => {
          const start = i > 0 ? ranges[i-1][1] : 0 - Number.EPSILON;
          ranges.push([start, v + start + Number.EPSILON]);
          return ranges;
        }, []);
    
        const choices = Array<number>();
        for(let i = 0; i < size; i++) {
          const random = Math.random();
          const rangeIndex = probabilityRanges.findIndex((v, i) => random > v[0] && random <= v[1]);
          choices.push(events[rangeIndex]);
        }
        return choices;
    }

    public static Quartiles(sample : Array<number>) : [number, number, number] {
      const x = sample.slice().sort((a,b) => a-b);
      const q1Index  = x.length * (1/4), 
            q2Index  = x.length * (2/4), 
            q3Index  = x.length * (3/4);

      return [Statistics.quartile(x, q1Index), Statistics.quartile(x, q2Index), Statistics.quartile(x, q3Index)];
    }

    private static quartile(x : Array<number>, quartileIndex : number) : number {
      if(Math.floor(quartileIndex) == quartileIndex) {
        return x[quartileIndex-1];
      }
      return (x[Math.floor(quartileIndex)-1] + x[Math.ceil(quartileIndex)-1]) / 2;
    }
    
    /**
     * @description Moods Median Test of Significance based on  https://sixsigmastudyguide.com/moods-median-non-parametric-hypothesis-test/
     * @param sampleA independent group A
     * @param sampleB independent group B
     * @returns boolean true=No difference (Not Rejected) false=Significant difference (Rejected) 
     */
    public static MoodsMedianTest(sampleA : Array<number>, sampleB : Array<number>) : boolean {
      const totalMedian = simplestats.median([].concat(sampleA).concat(sampleB));

      //2X2 contingency table
      const sampleAGrtnLen = sampleA.filter(v => v > totalMedian).length;
      const sampleANotGrtnLen = sampleA.length - sampleAGrtnLen;
      const sampleBGrtnLen = sampleB.filter(v => v > totalMedian).length;
      const sampleBNotGrtnLen = sampleB.length - sampleBGrtnLen; 
      const GrtnLen = sampleAGrtnLen + sampleBGrtnLen;
      const NotGrtnLen = sampleANotGrtnLen + sampleBNotGrtnLen; 
      const grandTotal = sampleA.length + sampleB.length;

      //chi-square χ2 test
      const sampleAGrtnLenChi = sampleA.length * GrtnLen / grandTotal;
      const sampleANotGrtnLenChi = sampleA.length * NotGrtnLen / grandTotal;
      const sampleBGrtnLenChi = sampleB.length * GrtnLen / grandTotal;
      const sampleBNotGrtnLenChi = sampleB.length * NotGrtnLen / grandTotal;

      //chi-square χ2 value
      const chiSquare =
        (sampleAGrtnLen - sampleAGrtnLenChi)**2 / sampleAGrtnLenChi + 
        (sampleANotGrtnLen - sampleANotGrtnLenChi)**2 / sampleANotGrtnLenChi + 
        (sampleBGrtnLen - sampleBGrtnLenChi)**2 / sampleBGrtnLenChi + 
        (sampleBNotGrtnLen - sampleBNotGrtnLenChi)**2 / sampleBNotGrtnLenChi;

      //significance level testing
      return simplestats.chiSquaredDistributionTable[1][0.05] > chiSquare;
    }

    public static Describe(x : Array<number>) : StatisticsDescriptive {
        const description = new StatisticsDescriptive();
        description.Median = Statistics.ToDecimalPlace(simplestats.median(x));
        description.Sum = Statistics.ToDecimalPlace(simplestats.sum(x));
        description.Min = Statistics.ToDecimalPlace(simplestats.min(x));
        description.Max = Statistics.ToDecimalPlace(simplestats.max(x));
        description.Skew = Statistics.ToDecimalPlace(simplestats.sampleSkewness(x));
        description.Kurtosis = Statistics.ToDecimalPlace(simplestats.sampleKurtosis(x));
        description.Quartiles = Statistics.Quartiles(x);
        description.HistogramRange = 250;
        description.Histogram = Statistics.Histogram(x, description.HistogramRange);
        description.Frequency = Statistics.ToDecimalPlace(Statistics.FrequencyTestBin(description.Histogram));
        return description;
    } 

    public static ToDecimalPlace(value : number, decimalPlaces : number = 1) : number {
      const diviser =  Math.pow(10, decimalPlaces);
      return Math.round((value + Number.EPSILON) * diviser) / diviser;
    }

    public static Reciprocal(n : number) : number {
      if(n == 0) return n;
      return 1/n;
    }
}
