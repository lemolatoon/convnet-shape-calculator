import { Conv2dSize, LayerFunction, SizeError } from "@/type/size";
import { exhaustiveChack, RequiredDeep } from "@/type/util";

export type Conv2dParams = [
  {
    name: "in_channels";
    val: number;
  },
  {
    name: "out_channels";
    val: number;
  },
  {
    name: "kernel_size";
    val: number;
  },
  {
    name: "stride";
    val?: number;
  },
  {
    name: "padding";
    val?: number;
  },
  {
    name: "dilation";
    val?: number;
  }
];
type Conv2dParamsObject = {
  in_channels: number;
  out_channels: number;
  kernel_size: number;
  stride?: number;
  padding?: number;
  dilation?: number;
};
export function Conv2dParamIndex(key: keyof Required<Conv2dParamsObject>) {
  switch (key) {
    case "in_channels":
      return 0;
    case "out_channels":
      return 1;
    case "kernel_size":
      return 2;
    case "stride":
      return 3;
    case "padding":
      return 4;
    case "dilation":
      return 5;
    default:
      exhaustiveChack(key);
      throw new Error("unreacheable");
  }
}
export const normalizeConv2dParams = (
  params: Conv2dParams
): RequiredDeep<Conv2dParams> => {
  const normalized = [...params];
  normalized[3].val = normalized[3].val ?? 1; // stride
  normalized[4].val = normalized[4].val ?? 0; // padding
  normalized[5].val = normalized[5].val ?? 1; // stride
  return normalized as RequiredDeep<Conv2dParams>;
};
export const conv2d: (params: RequiredDeep<Conv2dParams>) => {
  layer: LayerFunction<Conv2dSize>;
} = ([
  { val: in_channels },
  { val: out_channels },
  { val: kernel_size },
  { val: stride },
  { val: padding },
  { val: dilation },
]) => {
  const layer: LayerFunction<Conv2dSize> = (size) => {
    const { c_in, h_in, w_in } =
      size[3] !== undefined
        ? { c_in: size[1], h_in: size[2], w_in: size[3] }
        : { c_in: size[0], h_in: size[1], w_in: size[2] };
    if (in_channels !== c_in) {
      throw new SizeError(
        `Conv2d's in_channels != C_in, in_channels(This Conv2d): ${in_channels}, but C_in(passed Tensor's channel): ${c_in}`
      );
    }
    const h_out = Math.floor(
      (h_in + 2 * padding - dilation * (kernel_size - 1) - 1) / stride + 1
    );
    const w_out = Math.floor(
      (w_in + 2 * padding - dilation * (kernel_size - 1) - 1) / stride + 1
    );

    const features = [out_channels, h_out, w_out] as const;
    if (size[3] !== undefined) {
      return [size[0], ...features];
    } else {
      return [...features];
    }
  };
  return { layer };
};
