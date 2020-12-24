import React from "react";
import { ContainerProvider, useContainer } from "./container";
import { randomlyGetColor } from "../utils/randomlyGetColor";
import styles from "./styles.css";

export const Counter: React.FC = () => {
  return (
    <ContainerProvider>
      <div className={styles.root}>
        <Count />
        <CountButtons />
      </div>
    </ContainerProvider>
  );
};

const Count: React.FC = () => {
  const count = useContainer(container => container.count);

  // When this component is re-rendered, it generate a new color.
  const style = { color: randomlyGetColor() };

  return (
    <p className={styles.countText} style={style}>
      count: <span className={styles.countValue}>{count}</span>
    </p>
  );
};

const CountButtons: React.FC = () => {
  const increment = useContainer(container => container.increment);
  const decrement = useContainer(container => container.decrement);

  // When this component is re-rendered, it generate a new color.
  const style = { color: randomlyGetColor() };

  return (
    <div className={styles.countButtons}>
      <button className={styles.countButton} onClick={increment} style={style}>
        increment
      </button>
      <button className={styles.countButton} onClick={decrement} style={style}>
        decrement
      </button>
    </div>
  );
};
