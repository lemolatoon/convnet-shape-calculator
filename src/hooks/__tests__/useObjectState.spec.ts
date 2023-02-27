import { useObjectState } from "@/hooks/useObjectState";
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
    const testObject = {
      a: 1,
      b: 2,
      c: 3,
    };
    const { result } = renderHook(() => useObjectState(testObject));
    expect(result.current.obj).toEqual(testObject);
    act(() => result.current.dispatch("a", "50"));
    expect(result.current.obj.a).toEqual(50);
    act(() => result.current.dispatch("a", "25"));
    expect(result.current.obj.a).toEqual(25);
    act(() => result.current.dispatch("c", "10"));
    expect(result.current.obj.c).toEqual(10);
    act(() => result.current.dispatch("b", ""));
    expect(result.current.obj.b).toEqual("");
  });
});
