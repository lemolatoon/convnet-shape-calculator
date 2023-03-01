import { applyLayer } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { useState } from "react";

export const useSequentialLogic = <T extends Size>(
  initLayerFuncs: applyLayer<T>[]
) => {
  const [layers, setLayers] = useState(
    initLayerFuncs.map((initLayer, idx) => ({ layer: initLayer, id: idx }))
  );
  const genSequentialProps = (tensor?: Tensor<T>) => {
    const { layerUIs, tensors } = layers.reduce<{
      layerUIs: { layerUI: React.ReactElement; id: number }[];
      tensors: (Tensor<T> | undefined)[];
    }>(
      ({ layerUIs, tensors }, { layer, id }) => {
        const { layer: layerUI, tensor: nextTensor } = layer(
          tensors.slice(-1)[0]
        );
        return {
          layerUIs: [...layerUIs, { layerUI, id }],
          tensors: [...tensors, nextTensor],
        };
      },
      { layerUIs: [], tensors: [tensor] }
    );
    // `OnDragEndResponder` is not appropriately typed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnDragEnd: OnDragEndResponder = (result: any) => {
      const items = Array.from(layers);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setLayers(items);
    };
    return { layerUIs, tensors, handleOnDragEnd };
  };
  return genSequentialProps;
};
