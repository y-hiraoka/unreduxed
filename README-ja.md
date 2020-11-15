# unreduxed

> コンポーネントの再レンダリングに悩まされないためのライブラリ

`unreduxed` は React 用のステート管理ライブラリです。
このライブラリは次の 2 つの影響を受けています。

- `react-redux` https://react-redux.js.org/
- `unstated-next` https://github.com/jamiebuilds/unstated-next

## 特徴

- **シンプルな API**

- **余分な再レンダリングの抑制**

- **複数コンテナによる責務分割**

`unreduxed` は opinionated なライブラリではないので、`hooks` と `context` の使い方さえ知っていれば使用することができます。

## `unstated-next` の問題点

`unstated-next` は非常にシンプルなライブラリです。`context` を使用して `state` を他のコンポーネントに配信するだけです。しかし `context` が変化すると、それを購読するすべてのコンポーネントは再レンダリングされます。これは `context` を購読するコンポーネントの数が増えるにつれてパフォーマンスの問題を引き起こします。

`unreduxed` はこの問題を解決しました。`context` で配信している `state` が変化しても、 `useContainer` で取得する値に変化がなければ、そのコンポーネントは再レンダリングされません。
この挙動は `react-redux` の `useSelector` を参考にしています。

## Getting Started

### インストール

```
npm install unreduxed
```

### コンテナ作成

よくあるカスタムフックを定義して(コンテナフックと呼ぶことにしましょう)、 `unreduxed` に渡すことでコンテナを生成します。このコンテナフックが `return` する値がコンテナとして下位のコンポーネントに共有されます。
`unreduxed` が返す値は、`ContainerProvider` と `useContainer` を含む固定長タプルです(`unstated-next` は `{ Provider, useContainer }` オブジェクトを返しますが、この違いは好みでしかありません)。

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

あくまでただのカスタムフックなので、[フックのルール](https://reactjs.org/docs/hooks-rules.html)さえ守られていれば何でもできます(`useEffect` を使用したり、サードパーティ製フックを使用したり、`unreduxed` の別のコンテナを使用するなど)。

### `ContainerProvider` を配置する

`ContainerProvider` は `useCounter` を内部で実行してステートを保持するコンポーネントです。ステートを共有したいコンポーネントツリーの最上位に配置します。この `Provider` の外ではステートを使用することはできません(`context` の使い方を知っていれば理解できるはずです)。

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

### `useContainer` で値を取り出す

`useContainer` フックを使用して、コンテナから値を取り出します。 `useContainer` は引数として `selector` 関数を受け取ります。`selector` 関数は引数がコンテナ、戻り値がそこで使用したい値になるように定義します(`react-redux` の `useSeletor` と同じ使い方です)。

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

ここで `CountButtons` コンポーネントは `increment` と `decrement` をコンテナから取り出していますが、`count` は取り出していません。こうすることで関心のない `count` が変化しても再レンダリングされることを避けられます。これは通常の `context` の機能をそのまま使っている `unstated-next` では実現できないことです。

## API Reference

### **default exported function**

#### 型定義

```ts
function unreduxed<Container, Init = undefined>(useHook: (initialState?: Init) => Container): readonly [ContainerProvider, useContainer];
```

#### 使い方

```ts
function useAwesomeHook(initialValue?: number) {
  const [value, setValue] = React.useState(initialValue ?? 0);
  return { value, setValue };
}

const [ContainerProvider, useContainer] = unreduxed(useAwesomeHook);
```

#### 説明

値を返却するカスタムフック(コンテナフック)を定義して引数に渡すことでコンテナを生成します。コンテナフックには後述する `ContainerProvider` 経由で初期値を渡すことができます。ただし型定義上、`ContainerProvider` に初期値を渡すことを任意としているため、コンテナフックの引数は `undefined` である可能性を考慮に入れなければなりません。
TypeScript を使用している場合は `undefined` を受け入れるようにしていないとコンパイルエラーとなります。

### **ContainerProvider**

#### 型定義

```ts
type ContainerProviderProps<I, C> = ({ mock: C } | { initialState?: I }) & {
  children: React.ReactNode;
};

const ContaierProvider: React.FC<ContainerProviderProps<Init, Container>>;
```

#### 使い方

```tsx
const App: React.FC = () => {
  return (
    <ContainerProvider initialState={2}>
      <ChildComponent />
    </ContainerProvider>
  );
};
```

#### 説明

`props` のひとつである `initialState` に値を渡すと、コンテナフックの引数に初期値として渡されます。これは `unstated-next` の API を踏襲しています。

また、`props` のひとつである `mock` に値を渡すと、コンテナフックは実行されなくなり、代わりに `mock` が `ContainerProvider` によって配信されることになります。

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

これは Storybook のようなツールで見た目の確認を行う際に、任意のコンテナを注入できることを意味します。ただし、本番のアプリケーションで条件によって `mock` を渡したり `initialState` を渡すようなことは**絶対にしないで**ください。フックの実行順序が変わってしまうため、React がエラーを発生させます。TypeScript を使用している場合は、それらを同時に渡すとコンパイルエラーとなります。

### **useContainer**

#### 型定義

```ts
function useContainer(): Container;
function useContainer<T>(selector: (container: Container) => T, comparer?: (prev: T, next: T) => boolean): T;
```

#### 使い方

```tsx
const ChildComponent: React.FC = () => {
  const value = useContainer(container => container.value);

  return <span>{value} is awesome !</span>;
};
```

#### 説明

`react-redux` の `useSelector` の影響を受けたインターフェイスになっています。

`useContainer` フックに引数を渡さずに使用すると、コンテナ全体を取得することができます。しかし、コンテナが単一の値だけを含んでいるとき以外は、使用したいコンテナの値の数だけ `useContainer` を使用するべきです。
なぜなら、多くの場合コンテナフックの戻り値は毎回別のオブジェクトを返しているはずです([Getting Started](##Getting-Started) の例のように)。その場合、`useContainer` で毎回別のオブジェクトを取得してしまうことになるため、再レンダリングを避けられるという`unreduxed` の利点を活かすことができません。

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

`useContainer` フックには第 2 引数として比較関数を渡すことができます。これによって直前の値と次の値の等価性の判定をカスタマイズすることができます(`react-redux` の `useSelector` と同じ API)。指定されなかった場合は `===` による比較が行われます。

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
