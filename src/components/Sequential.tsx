import { LayerComponent } from "@/type/layer";
import { Size, Tensor } from "@/type/size";

export const Sequential =
  <T extends Size>(layers: LayerComponent<T>[]) =>
  (tensor: Tensor<T>) => {
    return layers.reduce(
      (prev, layer) => {
        const { layer: nextLayer, tensor: nextTensor } = layer(prev.tensor);
        return {
          layer: (
            <>
              {prev.layer}
              {nextLayer}
            </>
          ),
          tensor: nextTensor,
        };
      },
      { layer: <></>, tensor }
    );
  };
