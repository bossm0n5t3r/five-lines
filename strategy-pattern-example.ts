class ArrayMinimum {
  private processor: MinimumProcessor;
  constructor(private accumulator: number) {
    this.processor = new MinimumProcessor();
  }

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
  private processor: SumProcessor;
  constructor(private accumulator: number) {
    this.processor = new SumProcessor();
  }

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

class MinimumProcessor {}

class SumProcessor {}
