import { layerHookFactory } from "@/components/layers/common";
import { maxpool2d } from "@/components/layers/sizeFuncs";

export const useMaxPool2d = layerHookFactory("MaxPool2d", maxpool2d, 4);
