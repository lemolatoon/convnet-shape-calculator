import { renderLayer } from "@/components/ui/Layer";
import { Layer, SequentialParams } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { forward } from "@/utils/layer";
import { OnDragEndResponder } from "@hello-pangea/dnd";

export const useSequentialLogic = (
  params: SequentialParams,
  updateParams: (params: SequentialParams) => void
) => {
  const genSequentialProps = (tensor?: Tensor<Size>) => {
    const renderLayers: { renderLayer: () => JSX.Element; id: number }[] = [];
    const tensors: (Tensor<Size> | undefined)[] = [tensor];
    for (const [idx, { layer, id }] of params.layers.map((value, idx) => {
      return [idx, value] as const;
    })) {
      const updateLayer = (updatedLayer: Layer) => {
        const copiedParams: typeof params = JSON.parse(JSON.stringify(params));
        copiedParams.layers[idx] = { layer: updatedLayer, id };
        updateParams(copiedParams);
      };
      const addLayer = (newLayer: Layer) => {
        const copiedParams: typeof params = JSON.parse(JSON.stringify(params));
        const idMax = Math.max(...copiedParams.layers.map(({ id }) => id));
        copiedParams.layers.splice(idx + 1, 0, {
          layer: newLayer,
          id: idMax + 2,
        });
        updateParams(copiedParams);
      };
      const deleteLayer = () => {
        const copiedParams: typeof params = JSON.parse(JSON.stringify(params));
        copiedParams.layers.splice(idx, 1);
        updateParams(copiedParams);
      };
      const prevTensor = tensors.slice(-1)[0];
      const renderCurrrentLayer = () =>
        renderLayer(
          layer,
          updateLayer,
          addLayer,
          deleteLayer
        )({ tensor: prevTensor });
      const nextTensor = forward(layer, prevTensor);
      const renderLayerWithId = {
        renderLayer: renderCurrrentLayer,
        id,
      };
      renderLayers.push(renderLayerWithId);
      tensors.push(nextTensor);
    }
    // `OnDragEndResponder` is not appropriately typed
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleOnDragEnd: OnDragEndResponder = (result: any) => {
      const { layers } = params;
      const items = Array.from(layers);
      if (
        result.source == null ||
        result.source.index == null ||
        result.destination == null ||
        result.destination.index == null
      )
        return;
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      updateParams({ layers: items });
    };
    return { renderLayers, tensors, handleOnDragEnd };
  };
  return genSequentialProps;
};
