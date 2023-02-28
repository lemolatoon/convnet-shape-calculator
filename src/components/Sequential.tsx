import { LayerComponent } from "@/type/layer";
import { Size, Tensor } from "@/type/size";
import { useState } from "react";
import { MdDragIndicator } from "react-icons/md";
import styled from "styled-components";

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
    const layer = (
      <div>
        {layerUIs.map(({ layerUI, id }) => {
          return (
            <SequentialGrid key={id}>
              <IconWrappingBox>
                <StyledDragIndicator />
              </IconWrappingBox>
              <div>{layerUI}</div>
            </SequentialGrid>
          );
        })}
      </div>
    );
    return { layer, tensor: tensors.slice(-1)[0] };
  };
