import { Conv2dSize, LayerFunction, SizeError } from "@/type/size";
import { exhaustiveChack } from "@/type/util";

export type Conv2dParams = {
  in_channels: number;
  out_channels: number;
  kernel_size: number;
  stride?: number;
  padding?: number;
  dilation?: number;
};
export function Conv2dParamProprity(key: keyof Required<Conv2dParams>) {
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
export const conv2d: (params: Conv2dParams) => {
  layer: LayerFunction<Conv2dSize>;
  params: Required<Conv2dParams>;
} = ({
  stride: _stride,
  padding: _padding,
  dilation: _dilation,
  ...params
}) => {
  const passingParams: Required<Conv2dParams> = {
    stride: _stride ?? 1,
    padding: _padding ?? 0,
    dilation: _dilation ?? 1,
    ...params,
  };
  const { in_channels, out_channels, kernel_size, stride, padding, dilation } =
    passingParams;
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
  return { layer, params: passingParams };
};
