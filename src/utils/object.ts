import {
  GetPriorityFunc,
  LayerParams,
  PrimitiveLayerParams,
} from "@/type/layer";

export function addPriority<T extends PrimitiveLayerParams>(
  params: T,
  getPriority: GetPriorityFunc<T>
): LayerParams<PrimitiveLayerParams> {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        [key, { priority: getPriority(key), value: value }] as const
    )
    .reduce((prev, [key, value]) => {
      prev[key] = value;
      return prev;
    }, {} as LayerParams<PrimitiveLayerParams>);
}
