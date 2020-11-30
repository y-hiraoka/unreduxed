import { Notifier } from "../Notifier";

test("Only one function with the same reference", () => {
  let counter = 0;

  const listener = (container: number) => (counter = counter + container);

  const notifier = new Notifier(100);

  notifier.register(listener);
  notifier.register(listener);

  // 0 + 100
  notifier.notify();

  expect(counter).toBe(100);
});

test("can unregister the listener", () => {
  let counter = 0;

  const listener = (container: number) => (counter = counter + container);

  const notifier = new Notifier(100);

  notifier.register(listener);
  notifier.unregister(listener);

  notifier.notify();

  expect(counter).toBe(0);
});
