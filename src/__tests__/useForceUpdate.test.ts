import { act, renderHook } from "@testing-library/react-hooks";
import { useForceUpdate } from "../useForceUpdate";

test("useForceUpdate", () => {
  let renderCount = 0;

  const { result } = renderHook(() => {
    renderCount++;
    return useForceUpdate();
  });

  act(() => result.current());

  expect(renderCount).toBe(2);
});
