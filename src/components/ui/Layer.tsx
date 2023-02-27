import { useIsSp } from "@/hooks/useIsSp";
import { LayerParams, OnClickTypes, PrimitiveLayerParams } from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { ChangeEvent } from "react";
import styled from "styled-components";

export type LayerProps<T extends PrimitiveLayerParams> = {
  name: string;
  params: LayerParams<T>;
  sizeBeforeApply?: Size;
  sizeAfterApply?: Size;
  errorMsg?: string;
  onClicks: OnClickTypes<T>;
};
type LayerParamBoxProps = {
  n_columns?: number;
} & IsSpProps;
const LayerParamBox = styled.div<LayerParamBoxProps>`
  display: grid;
  grid-template-columns: repeat(${({ n_columns }) => `${n_columns ?? 4}`}, 1fr);
  font-size: ${({ isSp }) => (isSp ? `0.75em` : `32px`)};
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

type IsSpProps = {
  isSp?: boolean;
};
const Name = styled.div<IsSpProps>`
  font-size: ${({ isSp }) => (isSp ? `2em` : `50px`)};
  font-weight: bold;
`;

const SizeExpr = styled.div<IsSpProps>`
  font-size: ${({ isSp }) => (isSp ? `0.8em` : `32px`)};
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
  const isSp = useIsSp();
  return (
    <GridWrapper>
      <Grid>
        <Name isSp={isSp}>{name}</Name>
        <SizeExpr isSp={isSp}>{sizeExpression}</SizeExpr>
        <LayerParamBox n_columns={useIsSp(1200) ? 2 : 4} isSp={isSp}>
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
