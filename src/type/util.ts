import { ParamsBase, Value } from "@/type/layer";

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export function exhaustiveChack(_val: never) {}

export type RequiredDeep<T> = {
  [P in keyof T]-?: Required<T[P]>;
};

export const includesEmptyStrThrowsIfEmpty =
  <P extends ParamsBase>(constructErrMsg: (entry: [string, Value]) => string) =>
  (params: P): params is { [key in keyof P]: Exclude<P[key], ""> } => {
    Object.entries(params).forEach((entry) => {
      const val = entry[1];
      if (val === "") throw new Error(constructErrMsg(entry));
    });
    return true;
  };
