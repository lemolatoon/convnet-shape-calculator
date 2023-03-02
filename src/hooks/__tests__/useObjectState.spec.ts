import { useParamState } from "@/hooks/useObjectState";
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
    const testObject = [
      { name: "a", val: 1 },
      { name: "b", val: 2 },
      { name: "c", val: 3 },
    ];
    const { result } = renderHook(() => useParamState<number | "">(testObject));
    expect(result.current.obj).toEqual(testObject);
    act(() => result.current.dispatch(0, 50));
    expect(result.current.obj[0].val).toEqual(50);
    act(() => result.current.dispatch(0, 25));
    expect(result.current.obj[0].val).toEqual(25);
    act(() => result.current.dispatch(2, 10));
    expect(result.current.obj[2].val).toEqual(10);
    act(() => result.current.dispatch(1, ""));
    expect(result.current.obj[1].val).toEqual("");
  });
});
