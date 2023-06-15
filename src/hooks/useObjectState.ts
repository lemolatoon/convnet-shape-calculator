import { ParamsBase } from "@/type/layer";
import { useState } from "react";

export const useParamState = <
  P extends ParamsBase 
>(
  init: P,
  updateParams: (params: P) => void,
  normalizeParams?: (params: P) => P,
) => {
  const [params, setParams] = useState(init);
  const dispatch = <K extends keyof P>(key: K, val: P[K]) => {
    const copiedParams: typeof params = JSON.parse(JSON.stringify(params));
    copiedParams[key] = val;
    setParams(copiedParams);
    if (normalizeParams) {
      const normalized = normalizeParams(copiedParams);
      updateParams(normalized);
    } else {
      updateParams(copiedParams);
    }
  };
  return { params, dispatch };
};
