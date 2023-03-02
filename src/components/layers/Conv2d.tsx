import { layerHookFactory } from "@/components/layers/common";
import { conv2d } from "@/components/layers/sizeFuncs";

export const useConv2d = layerHookFactory("Conv2d", conv2d, 6);
