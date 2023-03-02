import { PrimitiveLayerParams, Value } from "@/type/layer";
import { useState } from "react";

export const useParamState = <
  T extends Value,
  U extends Value,
  P extends PrimitiveLayerParams<U>
>(
  init: PrimitiveLayerParams<T>,
  updateParams: (params: P) => void,
  normalizeParams: (params: PrimitiveLayerParams<T>) => P
) => {
  const [obj, setObj] = useState(init);
  const dispatch = (key: number, val: T) => {
    const copiedObj = [...obj];
    copiedObj[key].val = val;
    setObj(copiedObj);
    updateParams(normalizeParams(copiedObj));
  };
  return { obj, dispatch };
};
