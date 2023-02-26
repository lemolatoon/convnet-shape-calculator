import { LayerParams, OnClickTypes, PrimitiveLayerParams } from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { ChangeEvent } from "react";
import styled from "styled-components";
import { isNumberObject } from "util/types";

export type LayerProps<T extends LayerParams<PrimitiveLayerParams>> = {
  name: string;
  params: T;
  sizeBeforeApply?: Size;
  sizeAfterApply: Size;
  onClicks: OnClickTypes<T>;
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

type TransparentInputProps = {
  isReadonly: boolean;
};
const TransparentInput = styled.input<TransparentInputProps>`
  cursor: ${({ isReadonly }) => (isReadonly ? "pointer" : "auto")};
  border: none;
  background-color: inherit;
  font-size: inherit;
`;

export const Layer = <T extends LayerParams<PrimitiveLayerParams>>({
  name,
  params,
  sizeBeforeApply,
  sizeAfterApply,
  onClicks,
}: LayerProps<T>) => {
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
          .map(([key, val]) => {
            const onClick = onClicks[key];
            const isReadonly = onClick === undefined;
            console.log({key, isReadonly});
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              onClick ? onClick(Number(e.target.value)) : undefined
            };
            return (
              <div key={key}>
                {key}:
                <TransparentInput onChange={handleChange} isReadonly={isReadonly} readOnly={isReadonly} value={val.value} type="number" />
              </div>
            );
          })}
      </LayerParamBox>
    </Grid>
  );
};
