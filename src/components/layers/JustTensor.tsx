import { Layer } from "@/components/ui/Layer";
import { applyLayer } from "@/type/layer";
import { Size, Tensor } from "@/type/size";

const makeJustTensorApplyLayer =
  (name: string) =>
  <T extends Size>(
    tensor: Parameters<applyLayer<T>>[0]
  ): ReturnType<applyLayer<T>> => {
    return {
      layer: (
        <Layer
          name={name}
          params={{}}
          onClicks={() => undefined}
          sizeAfterApply={tensor?.shape}
        />
      ),
      tensor,
    };
  };

export const applyInput = <T extends Size>(tensor?: Tensor<T>) =>
  makeJustTensorApplyLayer("Input")(tensor);
export const applyOutput = <T extends Size>(tensor?: Tensor<T>) =>
  makeJustTensorApplyLayer("Output")(tensor);
