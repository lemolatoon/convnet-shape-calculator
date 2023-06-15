import { LayerFunction, Size, SizeError } from "@/type/size";
import { includesEmptyStrThrowsIfEmpty } from "@/type/util";

export type Conv2dParams = {
  in_channels: number | "";
  out_channels: number | "";
  kernel_size: number | "";
  stride: number | "";
  padding: number | "";
  dilation: number | "";
};
export const conv2d: (params: Conv2dParams) => LayerFunction<Size> = (
  params
) => {
  const layer: LayerFunction<Size> = (size) => {
    if (
      !includesEmptyStrThrowsIfEmpty<Conv2dParams>(([name]) => {
        throw new Error(`Conv2d param(${name}) is null.`);
      })(params)
    ) {
      throw new Error("unreacheable. (includeNoEmptyThrowsIfEmpty)");
    }
    const {
      in_channels,
      out_channels,
      kernel_size,
      stride,
      padding,
      dilation,
    } = params;
    if (size.length !== 3 && size.length !== 4)
      throw new SizeError(
        `Conv2d's input tensor's shape dimention must be 3 or 4. but got ${size.length}`
      );
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
  return layer;
};

export type MaxPool2dParams = {
  kernel_size: number | "";
  stride: number | "";
  padding: number | "";
  dilation: number | "";
};

export const maxpool2d = (params: MaxPool2dParams) => (size: Size) => {
  if (
    !includesEmptyStrThrowsIfEmpty<MaxPool2dParams>(([name]) => {
      throw new Error(`MaxPool2d param(${name}) is null.`);
    })(params)
  ) {
    throw new Error("unreacheable.");
  }
  const { kernel_size, stride, padding, dilation } = params;
  if (size.length !== 3 && size.length !== 4)
    throw new SizeError(
      `Conv2d's input tensor's shape dimention must be 3 or 4. but got ${size.length}`
    );
  const { c_in, h_in, w_in } =
    size[3] !== undefined
      ? { c_in: size[1], h_in: size[2], w_in: size[3] }
      : { c_in: size[0], h_in: size[1], w_in: size[2] };
  const h_out = Math.ceil(
    (h_in + 2 * padding - dilation * (kernel_size - 1) - 1) / stride + 1
  );
  const w_out = Math.ceil(
    (w_in + 2 * padding - dilation * (kernel_size - 1) - 1) / stride + 1
  );
  const features = [c_in, h_out, w_out] as const;
  if (size[3] !== undefined) {
    return [size[0], ...features];
  } else {
    return [...features];
  }
};
