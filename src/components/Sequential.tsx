import { applyLayer, SequentialParams } from "@/type/layer";
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
  renderLayers: { renderLayer: () => JSX.Element; id: number }[];
};
const SequentialLayout = ({
  handleOnDragEnd,
  renderLayers,
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
            {renderLayers.map(({ renderLayer, id }, index) => {
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
                      <div>{renderLayer()}</div>
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
  params: SequentialParams,
  updateParams: (params: SequentialParams) => void
): applyLayer<T> => {
  const genSequentialProps = useSequentialLogic(params, updateParams);
  const applyLayer = (tensor?: Tensor<T>) => {
    const { renderLayers, handleOnDragEnd } = genSequentialProps(tensor);
    return (
      <SequentialLayout
        renderLayers={renderLayers}
        handleOnDragEnd={handleOnDragEnd}
      />
    );
  };
  return applyLayer;
};
