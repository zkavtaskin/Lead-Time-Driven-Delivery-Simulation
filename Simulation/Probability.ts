
export class Probability {

  public static Choice(arr: Array<number>, size : number, p : Array<number> = null) : Array<number> {

    if(p != null && p.reduce((sum, v) => sum + v) + Number.EPSILON < 1) {
      throw Error("Overall probability has to be 1");
    }

    if(p == null) {
      p = new Array(arr.length).fill(1/arr.length);
    }

    if(arr.length != p.length) {
      throw Error("arr has to be same length as p");
    }

    const choices = Array<number>();

    const pRange = p.reduce((ranges, v, i) => {
      const start = i > 0 ? ranges[i-1][1] : 0;
      ranges.push([start, v + start + Number.EPSILON]);
      return ranges;
    }, [])

    for(let i = 0; i < size; i++) {
      const random = Math.random();
      const rangeIndex = this.mapToRange(random, pRange);
      choices.push(arr[rangeIndex]);
    }
    return choices;
  }

  private static mapToRange(random, pRange : Array<[number, number]>) {
    for(let i = 0; i < pRange.length; i++) {
      if(random > pRange[i][0] && random <= pRange[i][1]) {
        return i;
      }
    }
  }

}