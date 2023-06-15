import { MapperType, layerHookFactory } from "@/components/layers/common";
import { Conv2dParams, conv2d } from "@/components/layers/sizeFuncs";

const Conv2dStringMapper = (val: string) => (val === "" ? "" : Number(val));

const mappers: MapperType<Conv2dParams> = {
  in_channels: Conv2dStringMapper,
  dilation: Conv2dStringMapper,
  kernel_size: Conv2dStringMapper,
  out_channels: Conv2dStringMapper,
  padding: Conv2dStringMapper,
  stride: Conv2dStringMapper,
};
export const useConv2d = layerHookFactory("Conv2d", conv2d, mappers);
