export class Clock {

    private intervalSize : number;
    private ticks : number = 0;

    constructor(intervalSize : number) {
      this.intervalSize = intervalSize;
    }
  
    get IntervalSize() : number {
      return this.intervalSize;
    }
  
    get Ticks() : number {
      return this.ticks;
    }
  
    Tick() {
      this.ticks++;
    }
  }