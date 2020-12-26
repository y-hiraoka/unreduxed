import { createUseBundledHook } from "../createUseBundledHook";

const mockedHookA = () => ({ prop: "mockedA" });
const mockedHookB = () => ({ prop: "mockedB" });
const mockedHookC = (init?: number) => ({ prop: "mockedC", num: init });

const useBundledHook = createUseBundledHook({
  mockedA: mockedHookA,
  mockedB: mockedHookB,
  mockedC: mockedHookC,
});

test("without initialState", () => {
  const result = useBundledHook();

  expect(result.mockedA.prop).toBe("mockedA");
  expect(result.mockedB.prop).toBe("mockedB");
  expect(result.mockedC.prop).toBe("mockedC");
  expect(result.mockedC.num).toBeUndefined();
});

test("with initialState", () => {
  const result = useBundledHook({ mockedC: 100 });

  expect(result.mockedA.prop).toBe("mockedA");
  expect(result.mockedB.prop).toBe("mockedB");
  expect(result.mockedC.prop).toBe("mockedC");
  expect(result.mockedC.num).toBe(100);
});
