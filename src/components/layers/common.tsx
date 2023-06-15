import { useParamState } from "@/hooks/useObjectState";
import { applyLayer, OnClickTypes, ParamsBase } from "@/type/layer";
import { LayerFunction, Size, Tensor } from "@/type/size";
import { LayerBase } from "@/components/ui/Layer";

export type MapperType<T extends ParamsBase> = {
  [K in keyof T]: (val: string) => T[K];
};
export const layerHookFactory = <T extends ParamsBase>(
  name: string,
  f: (params: T) => LayerFunction<Size>,
  paramMappers: MapperType<T>
) => {
  const useLayer = (
    __params: T,
    updateParams: (params: T) => void
  ): applyLayer<Size> => {
    const { params, dispatch } = useParamState(__params, updateParams);
    const onClicks: OnClickTypes = Object.fromEntries(
      Object.keys(params).map((key) => {
        return [
          key,
          key in params
            ? (val) => dispatch(key, paramMappers[key](val))
            : undefined,
        ] as const;
      })
    );

    const applyLayer = (tensor: Tensor<Size> | undefined) => {
      const { sizeAfterApply, errorMsg } = (() => {
        if (!tensor) {
          return { sizeAfterApply: undefined, errorMsg: undefined };
        }
        try {
          const layerFunction = f(params);
          return {
            sizeAfterApply: layerFunction(tensor.shape),
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
