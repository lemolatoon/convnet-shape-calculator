import { applyLayer } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { OnDragEndResponder } from "@hello-pangea/dnd";
import { useState } from "react";

export const useSequentialLogic = <T extends Size>(
  initLayerFuncs: applyLayer<T>[]
) => {
  const [ids, setIds] = useState(initLayerFuncs.map((_, idx) => idx));
  const expandedIds = (() => {
    // adjust index
    if (ids.length === initLayerFuncs.length) {
      return ids;
    } else if (ids.length > initLayerFuncs.length) {
      return ids.slice(0, initLayerFuncs.length);
    } else {
      return [
        ...ids,
        ...Array.from({ length: initLayerFuncs.length - ids.length }).map(
          (_, idx) => ids.length + idx
        ),
      ];
    }
  })();
  const genSequentialProps = (tensor?: Tensor<T>) => {
    const { renderLayers, tensors } = expandedIds.reduce<{
      renderLayers: { renderLayer: () => JSX.Element; id: number }[];
      tensors: (Tensor<T> | undefined)[];
    }>(
      ({ renderLayers, tensors }, id) => {
        const { renderLayer, tensor: nextTensor } = initLayerFuncs[id](
          tensors.slice(-1)[0]
        );
        return {
          renderLayers: [...renderLayers, { renderLayer, id }],
          tensors: [...tensors, nextTensor],
        };
      },
      { renderLayers: [], tensors: [tensor] }
    );
    // `OnDragEndResponder` is not appropriately typed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnDragEnd: OnDragEndResponder = (result: any) => {
      const items = Array.from(ids);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setIds(items);
    };
    return { renderLayers, tensors, handleOnDragEnd };
  };
  return genSequentialProps;
};
