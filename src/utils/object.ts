import {
  GetPriorityFunc,
  LayerParamsWithEmptyString,
  PrimitiveLayerParams,
} from "@/type/layer";

export type AddEmptyString<T extends Record<string, number>> = {
  [K in keyof T]: number | "";
};

export function addPriority<T extends AddEmptyString<PrimitiveLayerParams>>(
  params: T,
  getPriority: GetPriorityFunc<T>
): LayerParamsWithEmptyString<PrimitiveLayerParams> {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        [key, { priority: getPriority(key), value: value }] as const
    )
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as LayerParamsWithEmptyString<PrimitiveLayerParams>);
}
