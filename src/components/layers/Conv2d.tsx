import {
  conv2d,
  Conv2dParamProprity,
  Conv2dParams,
  normalizeConv2dParams,
} from "@/components/layers/sizeFuncs";
import { Layer } from "@/components/ui/Layer";
import { useObjectState } from "@/hooks/useObjectState";
import { LayerComponent, OnClickTypes } from "@/type/layer";
import { Conv2dSize, Tensor } from "@/type/size";
import { addPriority } from "@/utils/object";

export const Conv2d = (__params: Conv2dParams): LayerComponent<Conv2dSize> => {
  const useLayerComponent = (tensor: Tensor<Conv2dSize>) => {
    const { obj: params, dispatch } = useObjectState(
      normalizeConv2dParams(__params)
    );
    const onClicks: OnClickTypes<Conv2dParams> = (key) => (val) =>
      dispatch(key, val);
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
  return useLayerComponent;
};
