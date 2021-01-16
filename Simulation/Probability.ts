
export class Probability {

  public static Choice(events: Array<number>, size : number, probability : Array<number> = null) : Array<number> {

    if(probability != null && probability.reduce((sum, v) => sum + v) + Number.EPSILON < 1) {
      throw Error("Overall probability has to be 1");
    }

    if(probability == null) {
      probability = new Array(events.length).fill(1/events.length);
    }

    if(events.length != probability.length) {
      throw Error("Events have to be same length as probability");
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

}