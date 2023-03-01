import {
  conv2d,
  Conv2dParamProprity,
  Conv2dParams,
  normalizeConv2dParams,
} from "@/components/layers/sizeFuncs";
import { Layer } from "@/components/ui/Layer";
import { useObjectState } from "@/hooks/useObjectState";
import { applyLayer as applyLayer, OnClickTypes } from "@/type/layer";
import { Conv2dSize, Tensor } from "@/type/size";
import { paramsHasNoNull } from "@/utils/layer";
import { addPriority } from "@/utils/object";

export const useConv2d = (__params: Conv2dParams): applyLayer<Conv2dSize> => {
  const { obj: params, dispatch } = useObjectState(
    normalizeConv2dParams(__params)
  );
  const applyLayer = (tensor: Tensor<Conv2dSize> | undefined) => {
    const onClicks: OnClickTypes<Conv2dParams> = (key) => (val) =>
      dispatch(key, val);
    const { sizeAfterApply, errorMsg } = (() => {
      if (!tensor) {
        return { sizeAfterApply: undefined, errorMsg: undefined };
      }
      try {
        const validate = (key: string, val: number) => {
          if (val < 0) throw new Error(`param (${key}) is negative: ${val}`);
        };
        if (!paramsHasNoNull<Conv2dParams>(params, validate))
          throw new Error("unreachable");
        const { layer: conv2dF } = conv2d(params);
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
      ></Layer>
    );

    return {
      layer,
      tensor: sizeAfterApply ? { shape: sizeAfterApply } : undefined,
    };
  };
  return applyLayer;
};
