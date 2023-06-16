import { Conv2dParams, MaxPool2dParams } from "@/components/layers/sizeFuncs";
import { JustTensorParams, Layer, SequentialParams } from "@/type/layer";
import { exhaustiveCheck } from "@/type/util";
import { Err, Ok, Result } from "neverthrow";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

function validateLayer(maybeParam: DeepPartial<Layer>): Result<Layer, string> {
  if (maybeParam.key == undefined) {
    return new Err("missing key");
  }
  const key = maybeParam.key;
  const noDelete = maybeParam.noDelete;
  const noDuplicate = maybeParam.noDuplicate;
  if (maybeParam.params == undefined) {
    return new Err("missing params");
  }

  switch (key) {
    case "Conv2d": {
      const result = validateConv2d(maybeParam.params);
      if (result.isErr()) return new Err(result.error);
      const params = result.value;
      return new Ok({
        key,
        params,
        noDelete,
        noDuplicate,
      });
    }
    case "MaxPool2d": {
      const result = validateMaxPool2d(maybeParam.params);
      if (result.isErr()) return new Err(result.error);
      const params = result.value;
      return new Ok({
        key,
        params,
        noDelete,
        noDuplicate,
      });
    }
    case "JustTensor": {
      const result = validateJustTensor(maybeParam.params);
      if (result.isErr()) return new Err(result.error);
      const params = result.value;
      return new Ok({
        key,
        params,
        noDelete,
        noDuplicate,
      });
    }
    case "Sequential": {
      const result = validateSequential(maybeParam.params);
      if (result.isErr()) return new Err(result.error);
      const params = result.value;
      return new Ok({
        key,
        params,
        noDelete,
        noDuplicate,
      });
    }
    default:
      exhaustiveCheck(key);
      return new Err("key exhaustiveCheck");
  }
}

function validateConv2d(
  maybeConv2dParam: DeepPartial<Conv2dParams>
): Result<Conv2dParams, string> {
  const { in_channels, out_channels, kernel_size, stride, padding, dilation } =
    maybeConv2dParam;

  if (in_channels == undefined) {
    return new Err("in_channels is missing");
  }
  if (out_channels == undefined) {
    return new Err("out_channels is missing");
  }
  if (kernel_size == undefined) {
    return new Err("kernel_size is missing");
  }
  if (stride == undefined) {
    return new Err("stride is missing");
  }
  if (padding == undefined) {
    return new Err("padding is missing");
  }
  if (dilation == undefined) {
    return new Err("dilation is missing");
  }

  return new Ok({
    in_channels,
    out_channels,
    kernel_size,
    stride,
    padding,
    dilation,
  });
}
function validateMaxPool2d(
  maybeMaxPool2d: DeepPartial<MaxPool2dParams>
): Result<MaxPool2dParams, string> {
  const { kernel_size, stride, padding, dilation } = maybeMaxPool2d;
  if (kernel_size == undefined) {
    return new Err("kernel_size is missing");
  }
  if (stride == undefined) {
    return new Err("stride is missing");
  }
  if (padding == undefined) {
    return new Err("padding is missing");
  }
  if (dilation == undefined) {
    return new Err("dilation is missing");
  }
  return new Ok({
    kernel_size,
    stride,
    padding,
    dilation,
  });
}
function validateJustTensor(
  maybeJustTensorParam: DeepPartial<JustTensorParams>
): Result<JustTensorParams, string> {
  const { name } = maybeJustTensorParam;
  if (name == undefined) {
    return new Err("name is missing");
  }
  return new Ok({
    name,
  });
}
function validateSequential(
  maybeSequentialParam: DeepPartial<SequentialParams>
): Result<SequentialParams, string> {
  const { layers } = maybeSequentialParam;
  if (layers == undefined) {
    return new Err("layers is missing");
  }
  const validatedLayers: SequentialParams["layers"] = [];
  for (const layerWithId of layers) {
    if (layerWithId == undefined)
      return new Err("layers array in SequentialPrams contains undefined.");
    const { layer, id } = layerWithId;
    if (layer == undefined)
      return new Err(
        "layer in layerWithId of layers(SequentialPrams) is missing"
      );
    if (id == undefined)
      return new Err("id in layerWithId of layers(SequentialPrams) is missing");
    const validated = validateLayer(layer);
    if (validated.isErr()) return new Err(validated.error);
    validatedLayers.push({ layer: validated.value, id });
  }

  return new Ok({
    layers: validatedLayers,
  });
}
