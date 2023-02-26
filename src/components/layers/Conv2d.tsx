import {
  conv2d,
  Conv2dParamProprity,
  Conv2dParams,
} from "@/components/layers/sizeFuncs";
import { Layer } from "@/components/ui/Layer";
import { LayerComponent } from "@/type/layer";
import { Conv2dSize, Tensor } from "@/type/size";
import { addPriority } from "@/utils/object";

export const Conv2d = (_params: Conv2dParams): LayerComponent<Conv2dSize> => {
  const { layer: conv2dF, params } = conv2d(_params);
  const layerComponent = (tensor: Tensor<Conv2dSize>) => {
    const sizeAfterApply = conv2dF(tensor.shape);
    const layer = (
      <Layer
        name={"Conv2d"}
        params={addPriority(params, Conv2dParamProprity)}
        sizeBeforeApply={tensor.shape}
        sizeAfterApply={sizeAfterApply}
      />
    );
    return { layer, tensor: { shape: sizeAfterApply } };
  };
  return layerComponent;
};
