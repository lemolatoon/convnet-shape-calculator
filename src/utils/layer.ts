import {
  conv2d,
  maxpool2d,
  normalizeConv2dParams,
  normalizeMaxPool2dParams,
} from "@/components/layers/sizeFuncs";
import { normalizeSequentialParams } from "@/hooks/useSequential";
import {
  Clone,
  Forward,
  Layer,
  LayerKey,
  param,
  PrimitiveLayerParams,
} from "@/type/layer";
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
          shape: conv2d(normalizeConv2dParams(layer.params))(tensor.shape),
        };
      case "Sequential":
        return layer.params.reduce(
          (inputTensor, nextLayer) => forward(nextLayer.layer, inputTensor),
          tensor as Tensor<Size> | undefined
        );
      case "JustTensor":
        return tensor;
      case "MaxPool2d":
        return {
          shape: maxpool2d(normalizeMaxPool2dParams(layer.params))(
            tensor.shape
          ),
        };
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

export const defaultLayer = <K extends LayerKey>(key: K): Layer => {
  switch (key) {
    case "Conv2d":
      return {
        key,
        params: normalizeConv2dParams([
          param("in_channels", 1),
          param("out_channels", 3),
          param("kernel_size", 3),
          param("stride", undefined),
          param("padding", undefined),
          param("dilation", undefined),
        ]),
      };
    case "MaxPool2d":
      return {
        key,
        params: normalizeMaxPool2dParams([
          param("kernel_size", 3),
          param("stride", undefined),
          param("padding", undefined),
          param("dilation", undefined),
        ]),
      };
    case "JustTensor":
      return { key, params: { name: "Tensor's name" } };
    case "Sequential":
      return {
        key,
        params: normalizeSequentialParams([defaultLayer("Conv2d")]),
      };
    default:
      exhaustiveChack(key);
      throw new Error("unreacheable");
  }
};
