import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { unreduxed } from "../unreduxed";

const useTestHook = ({ init }: { init?: number }) => {
  const [count, setCount] = React.useState(init ?? 0);

  const increment = React.useCallback(() => setCount(prev => prev + 1), []);
  const decrement = React.useCallback(() => setCount(prev => prev - 1), []);

  return { count, increment, decrement };
};

const [ContainerProvider, useContainer] = unreduxed(useTestHook);

let CountRenderingCount = 0;
const Count = () => {
  const count = useContainer(c => c.count);

  CountRenderingCount++;

  return <span title="test-count">{count}</span>;
};

let CounterRenderingCount = 0;
const Counter = () => {
  const increment = useContainer(c => c.increment);
  const decrement = useContainer(c => c.decrement);

  CounterRenderingCount++;

  return (
    <div>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
};

const App = () => {
  return (
    <ContainerProvider>
      <Count />
      <Counter />
    </ContainerProvider>
  );
};

test("unreduxed basic usage", () => {
  const { getByText } = render(<App />);

  expect(CountRenderingCount).toBe(1);
  expect(CounterRenderingCount).toBe(1);

  fireEvent.click(getByText("increment"));

  expect(CountRenderingCount).toBe(2);
  expect(CounterRenderingCount).toBe(1);

  fireEvent.click(getByText("decrement"));

  expect(CountRenderingCount).toBe(3);
  expect(CounterRenderingCount).toBe(1);
});
