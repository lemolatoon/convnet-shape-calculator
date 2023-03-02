import { LayerBase } from "@/components/ui/Layer";
import { applyLayer } from "@/type/layer";
import { Size } from "@/type/size";

export const makeJustTensorApplyLayer = (name: string) => {
  const JustTensor = <T extends Size>(
    tensor: Parameters<applyLayer<T>>[0]
  ): ReturnType<applyLayer<T>> => {
    return (
      <LayerBase
        name={name}
        params={[]}
        onClicks={() => undefined}
        sizeAfterApply={tensor?.shape}
      />
    );
  };
  return JustTensor;
};
