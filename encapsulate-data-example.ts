class Counter {
  private _counter = 0;
  getCounter() {
    return this._counter;
  }
  setCounter(c: number) {
    this._counter = c;
  }
}

let counter = new Counter();

const incrementCounter = (counter: Counter) => {
  counter.setCounter(counter.getCounter() + 1);
};

const main = () => {
  for (let i = 0; i < 10; i++) {
    incrementCounter(counter);
    console.log(counter.getCounter());
  }
};
