import React from "react";

export function useForceUpdate() {
  const [, setState] = React.useState(Number.MIN_SAFE_INTEGER);

  return () => setState(prev => prev + 1);
}
