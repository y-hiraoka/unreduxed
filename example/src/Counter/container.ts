import React from "react";
import unreduxed from "unreduxed";

const useCounter = () => {
  const [count, setCount] = React.useState(0);

  const increment = React.useCallback(() => setCount(prev => prev + 1), []);
  const decrement = React.useCallback(() => setCount(prev => prev - 1), []);

  return { count, increment, decrement };
};

export const [ContainerProvider, useContainer] = unreduxed(useCounter);
