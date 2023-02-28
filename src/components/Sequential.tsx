import { LayerComponent } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
} from "@hello-pangea/dnd";

const SequentialGrid = styled.div`
  display: grid;
  grid-template-columns: 2rem 1fr;
`;

const IconWrappingBox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
const StyledDragIndicator = styled(MdDragIndicator)`
  justify-content: center;
  font-size: 2rem;
`;

export const Sequential =
  <T extends Size>(_layers: LayerComponent<T>[]): LayerComponent<T> =>
  (tensor?: Tensor<T>) => {
    const [layers, setLayers] = useState(
      _layers.map((layer, idx) => ({ layer, id: idx }))
    );
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
    const handleOnDragEnd = (result: any) => {
      const items = Array.from(layers);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setLayers(items);
    };
    const layer = (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tempDrappableId">
          {(provided) => (
            <div
              className="tempDrappableId"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {layerUIs.map(({ layerUI, id }, index) => {
                return (
                  <Draggable key={id} draggableId={`${id}`} index={index}>
                    {(provided) => (
                      <SequentialGrid
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <IconWrappingBox>
                          <StyledDragIndicator />
                        </IconWrappingBox>
                        <div>{layerUI}</div>
                      </SequentialGrid>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
    return { layer, tensor: tensors.slice(-1)[0] };
  };
