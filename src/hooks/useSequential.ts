import { Layer, SequentialParams } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { forward } from "@/utils/layer";
import { OnDragEndResponder } from "@hello-pangea/dnd";

export const normalizeSequentialParams = (layers: Layer[]) => {
  return layers.map((layer, idx) => ({ layer, id: idx }));
};

export const useSequentialLogic = (
  params: SequentialParams,
  updateParams: (params: SequentialParams) => void
) => {
  const genSequentialProps = (tensor?: Tensor<Size>) => {
    const { renderLayers, tensors } = params.reduce<{
      renderLayers: { renderLayer: () => JSX.Element; id: number }[];
      tensors: (Tensor<Size> | undefined)[];
    }>(
      ({ renderLayers, tensors }, { layer, id }) => {
        const renderLayer = () => undefined as any; // TODO
        throw new Error("todo");
        const nextTensor = forward(layer, tensors.slice(-1)[0]);
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
      const items = Array.from(params);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      updateParams(items);
    };
    return { renderLayers, tensors, handleOnDragEnd };
  };
  return genSequentialProps;
};
