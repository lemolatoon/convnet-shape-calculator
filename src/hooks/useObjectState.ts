import { PrimitiveLayerParams, Value } from "@/type/layer";
import { useState } from "react";

export const useParamState = <T extends Value>(
  init: PrimitiveLayerParams<T>
) => {
  const [obj, setObj] = useState(init);
  const dispatch = (key: number, val: T) => {
    const copiedObj = [...obj];
    copiedObj[key].val = val;
    setObj(copiedObj);
  };
  return { obj, dispatch };
};
