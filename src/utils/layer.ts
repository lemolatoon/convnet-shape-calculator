import { conv2d, normalizeConv2dParams } from "@/components/layers/sizeFuncs";
import { Clone, Forward, Layer, PrimitiveLayerParams } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { exhaustiveChack } from "@/type/util";

export const paramsHasNoNull = <
  T extends string | number,
  U extends PrimitiveLayerParams<T>
>(
  params: PrimitiveLayerParams<T | "">,
  optionalValidate?: (key: string, val: T) => void
): params is U => {
  params.forEach(({ name, val }) => {
    if (typeof val === "string" && val === "") {
      throw new Error(`param (${name}) is null.`);
    } else if (optionalValidate) {
      optionalValidate(name, val);
    }
  });
  return true;
};

export const forward: Forward = (layer: Layer, tensor?: Tensor<Size>) => {
  if (!tensor) return undefined;
  try {
    switch (layer.key) {
      case "Conv2d":
        return {
          shape: conv2d(normalizeConv2dParams(layer.params)).layer(
            tensor.shape
          ),
        };
      case "Sequential":
        return layer.params.reduce(
          (inputTensor, nextLayer) => forward(nextLayer.layer, inputTensor),
          tensor as Tensor<Size> | undefined
        );
      case "JustTensor":
        return tensor;
      default:
        exhaustiveChack(layer);
        throw new Error("unreacheable");
    }
  } catch {
    return undefined;
  }
};

export const clone: Clone = <L extends Layer>(layer: L): L =>
  JSON.parse(JSON.stringify(layer)) as L;
