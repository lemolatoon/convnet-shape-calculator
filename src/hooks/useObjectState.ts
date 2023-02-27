import { useState } from "react";

type ParamObject = Record<string, number | "">;

export const useObjectState = <Keys extends keyof ParamObject>(
  init: Record<Keys, number | ""> 
) => {
  const [obj, setObj] = useState(init);
  const dispatch = (key: Keys, val: string) => {
    const copiedObj: Record<Keys, number | ""> = JSON.parse(JSON.stringify(obj));
    copiedObj[key] = val === "" ? "" as const : Number(val);
    setObj(copiedObj);
  };
  return { obj, dispatch };
};
