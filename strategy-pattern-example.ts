interface ElementProcessor {
  processElement(e: number): void;
  getAccumulator(): number;
}

class MinimumProcessor implements ElementProcessor {
  constructor(private accumulator: number) {}

  getAccumulator() {
    return this.accumulator;
  }

  processElement(e: number) {
    if (e < this.accumulator) {
      this.accumulator = e;
    }
  }
}

class SumProcessor implements ElementProcessor {
  constructor(private accumulator: number) {}

  getAccumulator() {
    return this.accumulator;
  }

  processElement(e: number) {
    this.accumulator += e;
  }
}

class BatchProcessor {
  constructor(private processor: ElementProcessor) {}

  process(elements: number[]) {
    for (let i = 0; i < elements.length; i++) {
      this.processor.processElement(elements[i]);
    }
    return this.processor.getAccumulator();
  }
}
