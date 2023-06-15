import { conv2d, maxpool2d } from "@/components/layers/sizeFuncs";
import { Clone, Forward, Layer, LayerKey } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { exhaustiveChack } from "@/type/util";

export const forward: Forward = (layer: Layer, tensor?: Tensor<Size>) => {
  if (!tensor) return undefined;
  try {
    switch (layer.key) {
      case "Conv2d":
        return {
          shape: conv2d(layer.params)(tensor.shape),
        };
      case "Sequential":
        return layer.params.layers.reduce(
          (inputTensor, nextLayer) => forward(nextLayer.layer, inputTensor),
          tensor as Tensor<Size> | undefined
        );
      case "JustTensor":
        return tensor;
      case "MaxPool2d":
        return {
          shape: maxpool2d(layer.params)(tensor.shape),
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
        params: {
          in_channels: 1,
          out_channels: 3,
          kernel_size: 3,
          stride: 1,
          padding: 0,
          dilation: 1,
        },
      };
    case "MaxPool2d":
      return {
        key,
        params: {
          kernel_size: 3,
          stride: 3,
          padding: 0,
          dilation: 1,
        },
      };
    case "JustTensor":
      return { key, params: { name: "Tensor's name" } };
    case "Sequential":
      return {
        key,
        params: {
          layers: [defaultLayer("Conv2d")].map((layer, id) => {
            return { layer, id };
          }),
        },
      };
    default:
      exhaustiveChack(key);
      throw new Error("unreacheable");
  }
};
