import { useParamState } from "@/hooks/useObjectState";
import { Value } from "@/type/layer";
import { act, renderHook } from "@testing-library/react";
import { useState } from "react";

describe("useObjectState", () => {
  test("vitest test", () => {
    const { result } = renderHook(() => useState(1));
    expect(result.current[0]).toEqual(1);
    act(() => result.current[1](2));
    expect(result.current[0]).toEqual(2);
  });
  test("approriately state changed", () => {
    type TestObject = {
      a: number | "";
      b: number | "";
      c: number | "";
    };
    const testObject: TestObject = {
      a: 1,
      b: 2,
      c: 3,
    };
    const updateParams = vitest.fn();
    const { result } = renderHook(() =>
      useParamState(testObject, updateParams)
    );
    expect(result.current.params).toEqual(testObject);
    act(() => result.current.dispatch("a", 50));
    expect(result.current.params["a"]).toEqual(50);
    act(() => result.current.dispatch("a", 25));
    expect(result.current.params["a"]).toEqual(25);
    act(() => result.current.dispatch("c", 10));
    expect(result.current.params["c"]).toEqual(10);
    act(() => result.current.dispatch("b", ""));
    expect(result.current.params["b"]).toEqual("");
    expect(updateParams).toBeCalledWith({
      a: 25,
      b: "",
      c: 10,
    });
  });
});
