import { applyLayer } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { MdDragIndicator } from "react-icons/md";
import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import { useSequentialLogic } from "@/hooks/useSequential";

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

type SequentialLayoutProps = {
  handleOnDragEnd: OnDragEndResponder;
  layerUIs: { layerUI: JSX.Element; id: number }[];
};
const SequentialLayout = ({
  handleOnDragEnd,
  layerUIs,
}: SequentialLayoutProps) => {
  return (
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
};

export const useSequential = <T extends Size>(
  applyLayers: applyLayer<T>[]
): applyLayer<T> => {
  const genSequentialProps = useSequentialLogic(applyLayers);
  const applyLayer = (tensor?: Tensor<T>) => {
    const { layerUIs, tensors, handleOnDragEnd } = genSequentialProps(tensor);
    return {
      layer: (
        <SequentialLayout
          layerUIs={layerUIs}
          handleOnDragEnd={handleOnDragEnd}
        />
      ),
      tensor: tensors.slice(-1)[0],
    };
  };
  return applyLayer;
};
