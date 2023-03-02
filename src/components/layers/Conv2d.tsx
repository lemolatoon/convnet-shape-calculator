import { conv2d, Conv2dParams } from "@/components/layers/sizeFuncs";
import { LayerBase } from "@/components/ui/Layer";
import { useParamState } from "@/hooks/useObjectState";
import {
  applyLayer as applyLayer,
  OnClickTypes,
  PrimitiveLayerParams,
} from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { RequiredDeep } from "@/type/util";
import { paramsHasNoNull } from "@/utils/layer";

const validate = (key: string, val: number) => {
  if (val < 0) throw new Error(`param (${key}) is negative: ${val}`);
};

const normalize = <T extends PrimitiveLayerParams<number>>(
  params: PrimitiveLayerParams<number | "">
): T => {
  return params.map(({ name, val }) => ({
    name,
    val: val === "" ? 0 : val,
  })) as T;
};

export const useConv2d = (
  __params: RequiredDeep<Conv2dParams>,
  updateParams: (params: RequiredDeep<Conv2dParams>) => void
): applyLayer<Size> => {
  const { obj: params, dispatch } = useParamState<
    number | "",
    number,
    RequiredDeep<Conv2dParams>
  >(__params, updateParams, normalize);
  const onClicks: OnClickTypes = (key) => (val) =>
    dispatch(key, val === "" ? "" : Number(val));
  const applyLayer = (tensor: Tensor<Size> | undefined) => {
    const { sizeAfterApply, errorMsg } = (() => {
      if (!tensor) {
        return { sizeAfterApply: undefined, errorMsg: undefined };
      }
      try {
        if (
          !paramsHasNoNull<number, RequiredDeep<Conv2dParams>>(params, validate)
        )
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
    return (
      <LayerBase
        name={"Conv2d"}
        params={params}
        sizeBeforeApply={tensor?.shape}
        sizeAfterApply={sizeAfterApply}
        onClicks={onClicks}
        errorMsg={errorMsg}
      />
    );
  };
  return applyLayer;
};
