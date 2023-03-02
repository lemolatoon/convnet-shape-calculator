import { applyLayer, Layer, SequentialParams } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { MdDragIndicator } from "react-icons/md";
import styled from "styled-components";
import {
  DragDropContext,
  Draggable,
  Droppable,
  OnDragEndResponder,
} from "@hello-pangea/dnd";
import {
  normalizeSequentialParams,
  useSequentialLogic,
} from "@/hooks/useSequential";
import { useId, useState } from "react";
import { renderLayer } from "@/components/ui/Layer";

const SequentialGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
`;
const IconWrappingBox = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;
const StyledDragIndicator = styled(MdDragIndicator)`
  justify-content: center;
  cursor: pointer;
  @media (max-width: 767px) {
    font-size: 16px;
  }
  @media (min-width: 767px) and (max-width: 1200px) {
    font-size: 32px;
  }
  @media (min-width: 1200px) {
    font-size: 2em;
  }
`;

const SequentialWrapper = styled.div`
  padding: 10px;
  border-radius: 10px;
  border: solid;
  margin: 0;
`;

type SequentialLayoutProps = {
  handleOnDragEnd: OnDragEndResponder;
  renderLayers: { renderLayer: () => JSX.Element; id: number }[];
};
const SequentialLayout = ({
  handleOnDragEnd,
  renderLayers,
}: SequentialLayoutProps) => {
  const droppableId = useId();
  return (
    <SequentialWrapper>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={droppableId}>
          {(provided) => (
            <div
              className={droppableId}
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
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </SequentialWrapper>
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

type SequentialProps = {
  initLayers: Layer[];
  inputTensor?: Tensor<Size>;
};
export const Sequential = ({ initLayers, inputTensor }: SequentialProps) => {
  const initSequentialLayer: Layer = {
    key: "Sequential",
    params: normalizeSequentialParams(initLayers),
  };
  const [sequentialLayer, setSequentialLayer] =
    useState<Layer>(initSequentialLayer);
  const Sequential = renderLayer(sequentialLayer, (layer) =>
    setSequentialLayer(layer)
  );
  return <Sequential tensor={inputTensor} />;
};
