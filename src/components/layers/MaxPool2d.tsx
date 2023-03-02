import { maxpool2d, MaxPool2dParams } from "@/components/layers/sizeFuncs";
import { LayerBase } from "@/components/ui/Layer";
import { useParamState } from "@/hooks/useObjectState";
import { PrimitiveLayerParams, applyLayer, OnClickTypes } from "@/type/layer";
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

export const useMaxPool2d = (
  __params: RequiredDeep<MaxPool2dParams>,
  updateParams: (params: RequiredDeep<MaxPool2dParams>) => void
): applyLayer<Size> => {
  const { obj: params, dispatch } = useParamState<
    number | "",
    number,
    RequiredDeep<MaxPool2dParams>
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
          !paramsHasNoNull<number, RequiredDeep<MaxPool2dParams>>(
            params,
            validate
          )
        )
          throw new Error("unreachable");
        const maxpool2dF = maxpool2d(params);
        return {
          sizeAfterApply: maxpool2dF(tensor.shape),
          errorMsg: undefined,
        };
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
        name={"MaxPool2d"}
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
