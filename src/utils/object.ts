import { GetPriorityFunc, LayerParams, Value } from "@/type/layer";

export function addPriority<T extends Record<string, string | number>>(
  params: T,
  getPriority: GetPriorityFunc<T>
): LayerParams {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        [key, { priority: getPriority(key), value: value }] satisfies [
          string,
          Value
        ]
    )
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as LayerParams);
}
