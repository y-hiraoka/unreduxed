import React from "react";
import { fireEvent, render } from "@testing-library/react";
import { bundleContainer } from "../bundleContainer";

const useCounter = (init?: number) => {
  const [count, setCount] = React.useState(init ?? 0);

  return {
    count,
    increment: React.useCallback(() => setCount(prev => prev + 1), []),
    decrement: React.useCallback(() => setCount(prev => prev - 1), []),
  };
};

const useUserAccount = () => {
  type User = { id: string; name: string };
  const [user, setUser] = React.useState<User>({ id: "", name: "" });

  React.useEffect(() => {
    setUser({ id: "user-id", name: "user-name" });
  }, []);

  return user;
};

const useText = (init?: string) => {
  const [text, setText] = React.useState(init ?? "");

  return { text, setText };
};

const [ContainerProvider, useContainer] = bundleContainer({
  counter: useCounter,
  user: useUserAccount,
  text: useText,
});

const renderCounts = {
  counterButtons: 0,
  count: 0,
  user: 0,
  text: 0,
  textEdit: 0,
};

const CounterButtons: React.VFC = () => {
  const increment = useContainer(c => c.counter.increment);
  const decrement = useContainer(c => c.counter.decrement);

  renderCounts.counterButtons = renderCounts.counterButtons + 1;

  return (
    <div>
      <button data-testid="increment-button" onClick={increment}>
        increment
      </button>
      <button data-testid="decrement-button" onClick={decrement}>
        increment
      </button>
    </div>
  );
};

const Count: React.VFC = () => {
  const count = useContainer(c => c.counter.count);

  renderCounts.count = renderCounts.count + 1;

  return <span data-testid="count-value">{count}</span>;
};

const User: React.VFC = () => {
  const user = useContainer(c => c.user);

  renderCounts.user = renderCounts.user + 1;

  return (
    <div>
      <span data-testid="user-id">{user.id}</span>
      <span data-testid="user-name">{user.name}</span>
    </div>
  );
};

const Text: React.VFC = () => {
  const text = useContainer(c => c.text.text);

  renderCounts.text = renderCounts.text + 1;

  return <span data-testid="text-value">{text}</span>;
};

const TextEdit: React.VFC = () => {
  const setText = useContainer(c => c.text.setText);

  renderCounts.textEdit = renderCounts.textEdit + 1;

  return <input data-testid="text-input" onChange={e => setText(e.target.value)} />;
};

const App: React.VFC = () => {
  return (
    <>
      <CounterButtons />
      <Count />
      <User />
      <Text />
      <TextEdit />
    </>
  );
};

test("bundleContainer basic usage.", () => {
  const { getByTestId } = render(
    <ContainerProvider>
      <App />
    </ContainerProvider>,
  );

  const countValueElement = getByTestId("count-value");
  const incrementButtonElement = getByTestId("increment-button");
  const decrementButtonElement = getByTestId("decrement-button");
  const userIdElement = getByTestId("user-id");
  const userNameElement = getByTestId("user-name");
  const textValueElement = getByTestId("text-value");
  const textInputElement = getByTestId("text-input");

  expect(userIdElement.innerHTML).toBe("user-id");
  expect(userNameElement.innerHTML).toBe("user-name");

  expect(renderCounts.counterButtons).toBe(1);
  expect(renderCounts.count).toBe(1);
  expect(renderCounts.user).toBe(2); // after useEffect ran.
  expect(renderCounts.text).toBe(1);
  expect(renderCounts.textEdit).toBe(1);

  // click increment button
  fireEvent.click(incrementButtonElement);

  expect(countValueElement.innerHTML).toBe("1");

  expect(renderCounts.counterButtons).toBe(1);
  expect(renderCounts.count).toBe(2);
  expect(renderCounts.user).toBe(2);
  expect(renderCounts.text).toBe(1);
  expect(renderCounts.textEdit).toBe(1);

  // click decrement button
  fireEvent.click(decrementButtonElement);

  expect(countValueElement.innerHTML).toBe("0");

  expect(renderCounts.counterButtons).toBe(1);
  expect(renderCounts.count).toBe(3);
  expect(renderCounts.user).toBe(2);
  expect(renderCounts.text).toBe(1);
  expect(renderCounts.textEdit).toBe(1);

  // input text
  fireEvent.input(textInputElement, { target: { value: "hogefugapiyo" } });

  expect(textValueElement.innerHTML).toBe("hogefugapiyo");

  expect(renderCounts.counterButtons).toBe(1);
  expect(renderCounts.count).toBe(3);
  expect(renderCounts.user).toBe(2);
  expect(renderCounts.text).toBe(2);
  expect(renderCounts.textEdit).toBe(1);
});
