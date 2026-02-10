import React, { useState } from 'react';

function CounterComponent() {
  const [_counter, setCounter] = useState(0);

  const _incrementCounter = () => {
    setCounter(prev => prev + 1);
  };

  return (
    <div data-testid="counter-root">
      <span data-testid="counter-display">{_counter}</span>
      <button
        aria-label="increment"
        data-testid="increment-button"
        onClick={_incrementCounter}
      >
        +
      </button>
    </div>
  );
}

export default CounterComponent;