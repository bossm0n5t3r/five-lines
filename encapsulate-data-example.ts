let counter = 0;

const incrementCounter = () => {
  counter++;
};

const main = () => {
  for (let i = 0; i < 10; i++) {
    incrementCounter();
    console.log(counter);
  }
};
