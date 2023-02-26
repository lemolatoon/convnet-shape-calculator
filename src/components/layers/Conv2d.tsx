import {
  conv2d,
  Conv2dParamProprity,
  Conv2dParams,
  normalizeConv2dParams,
} from "@/components/layers/sizeFuncs";
import { Layer } from "@/components/ui/Layer";
import { LayerComponent, OnClickTypes } from "@/type/layer";
import { Conv2dSize, Tensor } from "@/type/size";
import { addPriority } from "@/utils/object";
import { useState } from "react";

export const Conv2d = (__params: Conv2dParams): LayerComponent<Conv2dSize> => {

  const layerComponent = (tensor: Tensor<Conv2dSize>) => {
    const [params, setParams] = useState(normalizeConv2dParams(__params));
    const onClicks = Object.entries(params).reduce((prev, [key, val]) => {
      const obj = { ...prev };
      obj[key as keyof Required<Conv2dParams>] = (changedVal: number) => {
        const prevParams = params;
        prevParams[key as keyof Required<Conv2dParams>] = changedVal;
        setParams(prevParams);
      };
      return obj;
    }, {} as OnClickTypes<Conv2dParams>);
    const { layer: conv2dF } = conv2d(params);
    const sizeAfterApply = conv2dF(tensor.shape);
    const layer = (
      <Layer
        name={"Conv2d"}
        params={addPriority(params, Conv2dParamProprity)}
        sizeBeforeApply={tensor.shape}
        sizeAfterApply={sizeAfterApply}
        onClicks={onClicks}
      />
    );
    return { layer, tensor: { shape: sizeAfterApply } };
  };
  return layerComponent;
};
