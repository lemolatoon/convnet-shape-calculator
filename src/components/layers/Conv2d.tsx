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
  const useLayerComponent = (tensor: Tensor<Conv2dSize> | undefined) => {
    const { obj: params, dispatch } = useObjectState(
      normalizeConv2dParams(__params)
    );
    const onClicks: OnClickTypes<Conv2dParams> = (key) => (val) =>
      dispatch(key, val);
    const { layer: conv2dF } = conv2d(params);
    const { sizeAfterApply, errorMsg } = (() => {
      if (!tensor) {
        return { sizeAfterApply: undefined, errorMsg: undefined };
      }
      try {
        return { sizeAfterApply: conv2dF(tensor.shape), errorMsg: undefined };
      } catch (e: unknown) {
        let msg = "Unknown Error Occured";
        if (e instanceof Error) {
          msg = e.message;
        }
        return { errorMsg: msg, sizeAfterApply: undefined };
      }
    })();
    const layer = (
      <Layer
        name={"Conv2d"}
        params={addPriority(params, Conv2dParamProprity)}
        sizeBeforeApply={tensor?.shape}
        sizeAfterApply={sizeAfterApply}
        onClicks={onClicks}
        errorMsg={errorMsg}
      />
    );
    return {
      layer,
      tensor: sizeAfterApply ? { shape: sizeAfterApply } : undefined,
    };
  };
  return useLayerComponent;
};
