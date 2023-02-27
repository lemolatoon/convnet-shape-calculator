import {
  LayerParamsWithEmptyString,
  OnClickTypes,
  PrimitiveLayerParams,
} from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { ChangeEvent } from "react";
import styled from "styled-components";

export type LayerProps<T extends PrimitiveLayerParams> = {
  name: string;
  params: LayerParamsWithEmptyString<T>;
  sizeBeforeApply?: Size;
  sizeAfterApply?: Size;
  errorMsg?: string;
  onClicks: OnClickTypes<T>;
};
const LayerParamBox = styled.div`
  display: grid;
  @media (max-width: 767px) {
    font-size: 0.75em;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 767px) and (max-width: 1200px) {
    font-size: 32px;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1200px) {
    font-size: 32px;
    grid-template-columns: repeat(4, 1fr);
  }
`;

const LayerParam = styled.div`
  display: flex;
`;
const ErrorMessage = styled.text`
  align-self: flex-end;
  color: red;
`;

const GridWrapper = styled.div`
  padding: 10px;
  border-radius: 10px;
  border: solid;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;

  > ${LayerParamBox} {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 2;
  }
`;

const Name = styled.div`
  @media (max-width: 767px) {
    font-size: 2em;
  }
  @media (min-width: 767px) {
    font-size: 50px;
  }
  font-weight: bold;
`;

const SizeExpr = styled.div`
  @media (max-width: 767px) {
    font-size: 0.8em;
  }
  @media (min-width: 767px) {
    font-size: 32px;
  }
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
  margin-right: auto;
  width: 100px;
  border: none;
  background-color: inherit;
  font-size: inherit;
`;

export const Layer = <T extends PrimitiveLayerParams>({
  name,
  params,
  sizeBeforeApply,
  sizeAfterApply,
  onClicks,
  errorMsg,
}: LayerProps<T>) => {
  const sizeExpression = (() => {
    if (sizeBeforeApply && sizeAfterApply) {
      return `${displaySize(sizeBeforeApply)} → ${displaySize(sizeAfterApply)}`;
    } else if (sizeAfterApply) {
      return displaySize(sizeAfterApply);
    } else if (sizeBeforeApply) {
      return `${displaySize(sizeBeforeApply)} →`;
    }
  })();
  return (
    <GridWrapper>
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
              const onClick = onClicks(key);
              const isReadonly = onClick === undefined;
              const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                onClick ? onClick(e.target.value) : undefined;
              };
              return (
                <LayerParam key={key}>
                  {key}:
                  <TransparentInput
                    onChange={handleChange}
                    isReadonly={isReadonly}
                    readOnly={isReadonly}
                    value={val.value}
                    type="number"
                  />
                </LayerParam>
              );
            })}
        </LayerParamBox>
      </Grid>
      {errorMsg ? <ErrorMessage>{errorMsg}</ErrorMessage> : undefined}
    </GridWrapper>
  );
};
