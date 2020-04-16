class Task {

    private original: number;
    private remaining: number;
    private actual: number;

    constructor(effort : number) {
      this.original = effort;
      this.remaining = effort;
      this.actual = effort;
    }
  
    get Original() : number {
      return this.original;
    }
  
    get Remaining() : number {
      return this.remaining;
    }
  
    set Remaining(value : number) {
      this.remaining = value;
    }
  
    get Actual() : number {
      return this.actual;
    }
  
    set Actual(value : number) {
      this.actual = value;
    }
  }