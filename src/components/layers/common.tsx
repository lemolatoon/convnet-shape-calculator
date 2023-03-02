import { useParamState } from "@/hooks/useObjectState";
import { PrimitiveLayerParams, applyLayer, OnClickTypes } from "@/type/layer";
import { LayerFunction, Size, Tensor } from "@/type/size";
import { LayerBase } from "@/components/ui/Layer";

const validate = (key: string, val: number) => {
  if (val < 0) throw new Error(`param (${key}) is negative: ${val}`);
};

export const layerHookFactory = <T extends PrimitiveLayerParams<number | "">>(
  name: string,
  f: (params: T) => LayerFunction<Size>,
  paramsLength: number
) => {
  const useLayer = (
    __params: T,
    updateParams: (params: T) => void
  ): applyLayer<Size> => {
    const { obj: params, dispatch } = useParamState<
      number | "",
      number | "",
      T
    >(__params, updateParams, (val) => val as T);
    const onClicks: OnClickTypes = (key) => (val) =>
      dispatch(key, val === "" ? "" : Number(val));

    const applyLayer = (tensor: Tensor<Size> | undefined) => {
      const { sizeAfterApply, errorMsg } = (() => {
        if (!tensor) {
          return { sizeAfterApply: undefined, errorMsg: undefined };
        }
        try {
          if (params.length < paramsLength) throw new Error("Illegal params");
          params.forEach(
            ({ name, val }) => val !== "" && validate(name, Number(val))
          );
          const conv2dF = f(params as T);
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
          name={name}
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
  return useLayer;
};
