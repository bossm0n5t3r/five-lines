class ArrayMinimum {
  constructor(private accumulator: number) {}

  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processElement(arr[i]);
    }
    return this.accumulator;
  }

  processElement(e: number) {
    if (e < this.accumulator) {
      this.accumulator = e;
    }
  }
}

class ArraySum {
  constructor(private accumulator: number) {}

  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++) {
      this.processElement(arr[i]);
    }
    return this.accumulator;
  }

  processElement(e: number) {
    this.accumulator += e;
  }
}
