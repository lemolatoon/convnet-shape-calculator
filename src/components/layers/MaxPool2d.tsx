import { MapperType, layerHookFactory } from "@/components/layers/common";
import { MaxPool2dParams, maxpool2d } from "@/components/layers/sizeFuncs";

const maxPool2dStringMapper = (val: string) => (val === "" ? "" : Number(val));

const mappers: MapperType<MaxPool2dParams> = {
  dilation: maxPool2dStringMapper,
  kernel_size: maxPool2dStringMapper,
  padding: maxPool2dStringMapper,
  stride: maxPool2dStringMapper,
};
export const useMaxPool2d = layerHookFactory("MaxPool2d", maxpool2d, mappers);
