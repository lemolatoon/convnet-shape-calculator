import { LayerParams } from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { FC } from "react";
import styled from "styled-components";

export type LayerProps = {
  name: string;
  params: LayerParams;
  sizeBeforeApply?: Size;
  sizeAfterApply: Size;
};
const LayerParamBox = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  font-size: 32px;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  grid-auto-rows: minmax(50px, auto);
  padding: 10px;
  border-radius: 10px;
  border: solid;

  > ${LayerParamBox} {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 2;
  }
`;

const Name = styled.div`
  font-size: 50px;
  font-weight: bold;
`;

const SizeExpr = styled.div`
  font-size: 32px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: right;
`;

export const Layer: FC<LayerProps> = ({
  name,
  params,
  sizeBeforeApply,
  sizeAfterApply,
}) => {
  const sizeExpression = sizeBeforeApply
    ? `${displaySize(sizeBeforeApply)} → ${displaySize(sizeAfterApply)}`
    : displaySize(sizeAfterApply);
  return (
    <Grid>
      <Name>{name}</Name>
      <SizeExpr>{sizeExpression}</SizeExpr>
      <LayerParamBox>
        {Object.entries(params)
          .sort(
            ([, { priority: priorityA }], [, { priority: priorityB }]) =>
              priorityA - priorityB
          )
          .map(([key, val]) => (
            <div key={key}>
              {key}: {val.value}
            </div>
          ))}
      </LayerParamBox>
    </Grid>
  );
};
