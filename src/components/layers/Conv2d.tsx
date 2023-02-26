import {
  conv2d,
  Conv2dParamProprity,
  Conv2dParams,
} from "@/components/layers/sizeFuncs";
import { Layer } from "@/components/ui/Layer";
import { Conv2dSize, Tensor } from "@/type/size";
import { addPriority } from "@/utils/object";

type Conv2dProps = {
  tensor: Tensor<Conv2dSize>;
};
export const Conv2d = (_params: Conv2dParams) => {
  const { layer: conv2dF, params } = conv2d(_params);
  return function Conv2d({ tensor }: Conv2dProps) {
    const sizeAfterApply = conv2dF(tensor.shape);
    return (
      <Layer
        name={"Conv2d"}
        params={addPriority(params, Conv2dParamProprity)}
        sizeBeforeApply={tensor.shape}
        sizeAfterApply={sizeAfterApply}
      />
    );
  };
};
