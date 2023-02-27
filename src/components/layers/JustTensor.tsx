import { Layer } from "@/components/ui/Layer";
import { LayerComponent } from "@/type/layer";
import { Size, Tensor } from "@/type/size";

const JustTensor =
  (name: string) =>
  <T extends Size>(
    tensor: Parameters<LayerComponent<T>>[0]
  ): ReturnType<LayerComponent<T>> => {
    return {
      layer: (
        <Layer
          name={name}
          params={{}}
          onClicks={() => undefined}
          sizeAfterApply={tensor?.shape}
        />
      ),
      tensor: tensor,
    };
  };

export const Input = <T extends Size>(tensor?: Tensor<T>) =>
  JustTensor("Input")(tensor);
export const Output = <T extends Size>(tensor?: Tensor<T>) =>
  JustTensor("Output")(tensor);
