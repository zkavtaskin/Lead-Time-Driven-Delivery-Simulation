export class Clock {

    private effortSize : number;
    private ticks : number = 0;

    constructor(effortSize : number) {
      this.effortSize = effortSize;
    }
  
    get EffortSize() : number {
      return this.effortSize;
    }
  
    get Ticks() : number {
      return this.ticks;
    }

    Tick() {
      this.ticks++;
    }
  }