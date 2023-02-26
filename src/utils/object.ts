import {
  GetPriorityFunc,
  LayerParams,
  NormalizedPrimitiveLayerParams,
  PrimitiveLayerParams,
  Value,
} from "@/type/layer";

export function addPriority<T extends PrimitiveLayerParams>(
  params: T,
  getPriority: GetPriorityFunc<T>
): LayerParams<PrimitiveLayerParams> {
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
    }, {} as LayerParams<PrimitiveLayerParams>);
}
