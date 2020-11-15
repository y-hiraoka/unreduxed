# unreduxed

> a library to never think about re-rendering of React components ever again

`unreduxed` is a state management library for React.
This is inspired by

- `react-redux` https://react-redux.js.org/
- `unstated-next` https://github.com/jamiebuilds/unstated-next

## features

- **simpler API**

- **suppress extra re-rendering**

- **split responsibilities by multiple containers**

`unreduxed` is **not** opinionated library, so You just need to know usage of `hooks` and `context`.

## a problem of `unstated-next`

`unstated-next` is very simple library. It just uses `context` to deliver `state` to other components. But when `context` changes, all components that subscribe to it will be re-rendered. This causes perfomance issues as the number of components subscribing to `context` increases.

`unreduxed` solves this problem. If `state` provided by `context` changes, but the value obtained by `useContainer` does not change, the component will not be re-rendered. This behavior is inspired by the `useSelector` of `react-redux`.

## Getting Started

### install

```
npm install unreduxed
```

### create a container

We create a container by defining a common custom hook (let's call it a container hook) and passing it to `unreduxed`. The value that this container hook returns will be shared as a container with child components. The value returned by `unreduxed` is a fixed-length tuple containing `ContainerProvider` and `useContainer` (`unstated-next` returns a `{ Provider, useContainer }` object, but this difference is just a preference).

```tsx
import React from "react";
import unreduxed from "unreduxed";

const useCounter = () => {
  const [count, setCount] = React.useState(0);

  const increment = React.useCallback(() => setCount(prev => prev + 1), []);
  const decrement = React.useCallback(() => setCount(prev => prev - 1), []);

  return { count, increment, decrement };
};

export const [ContainerProvider, useContainer] = unreduxed(useCounter);
```

The container hook is just a custom hook, so we can do anything as long as [the hook rules](https://reactjs.org/docs/hooks-rules.html) are followed (use `useEffect`, use a third-party hook, use another container by `unreduxed`, etc).

### Place `ContainerProvider`

`ContainerProvider` is a component that internally executes `useCounter` to hold its state. Place it at the top of the component tree where you want to share the state. We can't use states outside of this `Provider` (you should know how to use `context`).

```tsx
const Counter: React.FC = () => {
  return (
    <ContainerProvider>
      <Count />
      <CountButtons />
    </ContainerProvider>
  );
};
```

### Retrieve a value with `useContainer`

We can use `useContainer` hook to retrieve the value from the container. `useContainer` takes the `selector` function as an argument. The `selector` function is defined so that the argument is a container and the return value is what you want to use there (same usage as `useSelector` in `react-redux`).

```tsx
const Count: React.FC = () => {
  const count = useContainer(container => container.count);

  return <p>count: {count}</p>;
};

const CountButtons: React.FC = () => {
  const increment = useContainer(container => container.increment);
  const decrement = useContainer(container => container.decrement);

  return (
    <div>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  );
};
```

Here the `CountButtons` component is retrieving `increment` and `decrement` from the container, but not `count`. This will prevent `CountButtons` from re-rendering when the uninsteresting `count` changes. This is not possible with `unstated-next`, which uses the normal functionality of `context` as is.

## API Reference

### **default exported function**

#### type definition

```ts
function unreduxed<Container, Init = undefined>(useHook: (initialState?: Init) => Container): readonly [ContainerProvider, useContainer];
```

#### usage

```ts
function useAwesomeHook(initialValue?: number) {
  const [value, setValue] = React.useState(initialValue ?? 0);
  return { value, setValue };
}

const [ContainerProvider, useContainer] = unreduxed(useAwesomeHook);
```

#### description

You create a container by defining a custom hook (container hook) that returns a value and passing it as an argument. You can pass a initial value to the container hook via `ContainerProvider` described later. However, since the type definition makes it optional to pass the initial value to `ContainerProvider`, the argument of the container hook must take into account the possibility of `undefined`.
If you are using TypeScript, you will get a compile error if you do not accept `undefined`.

### **ContainerProvider**

#### type definition

```ts
type ContainerProviderProps<I, C> = ({ mock: C } | { initialState?: I }) & {
  children: React.ReactNode;
};

const ContaierProvider: React.FC<ContainerProviderProps<Init, Container>>;
```

#### usage

```tsx
const App: React.FC = () => {
  return (
    <ContainerProvider initialState={2}>
      <ChildComponent />
    </ContainerProvider>
  );
};
```

#### description

If you pass a value to `initialState`, which is one of `props`, it will be passed as an initial value to the argument of the container hook. It follows the `unstated-next` API.

Also, if you pass a value to `mock`, which is one of `props`, the container hook will not be executed and instead `mock` will be provided by `ContainerProvider`.

```tsx
const MockProvider: React.FC = () => {
  const mock = {
    value: 10,
    setValue: () => {
      console.log("setValue() called.");
    },
  };

  return (
    <ContainerProvider mock={mock}>
      <ChildComponent />
    </ContainerProvider>
  );
};
```

This means that you can inject any container when looking at it with a tool a tool like Storybook. However, **never** pass `mock` or `initialState` depending on the conditions in your production application. React raises an error because the hooks are executed in a different order. If you are using TypeScript, passing them at the same time will result in a compilation error.

### **useContainer**

#### type definition

```ts
function useContainer(): Container;
function useContainer<T>(selector: (container: Container) => T, comparer?: (prev: T, next: T) => boolean): T;
```

#### usage

```tsx
const ChildComponent: React.FC = () => {
  const value = useContainer(container => container.value);

  return <span>{value} is awesome !</span>;
};
```

#### description

This interface is inspired by the `useSelector` of` react-redux`.

You can get the entire container by using the `useContainer` hook without any arguments. However, you should use it for as many container values as you want to use, except when the container is returning only a single value.
Because in most cases the return value of a container hook should return a different object each time (as in the [Getting Started](##Getting-Started) example). In that case, you can't take advantage of `unreduxed`, which avoids re-rendering, because you end up getting another object with` useContainer` each time.

```tsx
const ChildComponent: React.FC = () => {
  const count = useContainer(container => container.count);
  const name = useContainer(container => container.name);

  return (
    <div>
      <p>Hello {name} !</p>
      <p>Your count is {count} !</p>
    </div>
  );
};
```

You can pass a comparer function as the second argument to the `useContainer` hook. This allows you to customize the determination of equivalence between the previous and next values (same API as `useSelector` in` react-redux`). If not specified, a comparison is made by `===`.

```tsx
const ChildComponent: React.FC = () => {
  const user = useContainer(
    container => container.user,
    (prev, next) => prev.userId === next.userId,
  );

  return (
    <p>
      {user.userId}: {user.userName}
    </p>
  );
};
```
