import { LayerFunction, Size, SizeError } from "@/type/size";

type Conv2dParams = {
  in_channels: number;
  out_channels: number;
  kernel_size: number;
  stride?: number;
  padding?: number;
  dilation?: number;
};
type Conv2dDim = [number, number, number] | [number, number, number, number];
type Conv2dSize = {
  dims: Conv2dDim;
};
export const conv2d: (params: Conv2dParams) => LayerFunction<Conv2dSize> =
  ({ stride: _stride, padding: _padding, dilation: _dilation, ...params }) =>
  (size) => {
    const {
      in_channels,
      out_channels,
      kernel_size,
      stride,
      padding,
      dilation,
    }: Required<Conv2dParams> = {
      stride: _stride ?? 1,
      padding: _padding ?? 0,
      dilation: _dilation ?? 1,
      ...params,
    };
    const { c_in, h_in, w_in } =
      size.dims[3] !== undefined
        ? { c_in: size.dims[1], h_in: size.dims[2], w_in: size.dims[3] }
        : { c_in: size.dims[0], h_in: size.dims[1], w_in: size.dims[2] };
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
    if (size.dims[3] !== undefined) {
      return { dims: [size.dims[0], ...features] };
    } else {
      return { dims: [...features] };
    }
  };
