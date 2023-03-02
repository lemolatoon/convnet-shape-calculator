import { useConv2d } from "@/components/layers/Conv2d";
import { makeJustTensorApplyLayer } from "@/components/layers/JustTensor";
import { Conv2dParams } from "@/components/layers/sizeFuncs";
import { useSequential } from "@/components/Sequential";
import {
  Layer,
  LayerComponent,
  OnClickTypes,
  PrimitiveLayerParams,
  Render,
  RenderProps,
  SequentialParams,
} from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { exhaustiveChack, RequiredDeep } from "@/type/util";
import { ChangeEvent } from "react";
import styled from "styled-components";
import { BiDuplicate } from "react-icons/bi";
import { clone } from "@/utils/layer";

export type LayerProps<T extends string | number | undefined> = {
  name: string;
  params: PrimitiveLayerParams<T>;
  sizeBeforeApply?: Size;
  sizeAfterApply?: Size;
  errorMsg?: string;
  onClicks: OnClickTypes;
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

export const LayerBase = <T extends string | number>({
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
          {params.map(({ name, val }, key) => {
            const onClick = onClicks(key);
            const isReadonly = onClick === undefined;
            const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
              onClick ? onClick(e.target.value) : undefined;
            };
            return (
              <LayerParam key={key}>
                {name}:
                <TransparentInput
                  onChange={handleChange}
                  isReadonly={isReadonly}
                  readOnly={isReadonly}
                  value={val}
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

const StyledDuplicateButton = styled(BiDuplicate)`
  cursor: pointer;
  font-size: 2em;
`;
const LayerWrapper = styled.div``;
const LayerHOCBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  > ${StyledDuplicateButton} {
    grid-row-start: 0;
    grid-row-end: 1;
    grid-column-start: 0;
    grid-column-end: 1;
  }

  > ${LayerWrapper} {
    grid-row-start: 0;
    grid-row-end: 1;
    grid-column-start: 2;
    grid-column-end: 3;
  }
`;

const AddCommonsAlongAllLayers = (
  PureLayer: LayerComponent,
  onDuplicate?: () => void
): LayerComponent =>
  function AppliedLayer({ tensor }: RenderProps) {
    if (!onDuplicate) return <PureLayer tensor={tensor} />;
    return (
      <LayerHOCBox>
        <StyledDuplicateButton onClick={onDuplicate} />
        <LayerWrapper>
          <PureLayer tensor={tensor} />
        </LayerWrapper>
      </LayerHOCBox>
    );
  };

export const renderLayer: Render = (
  layer: Layer,
  updateLayer: (layer: Layer) => void,
  addLayer?: (layer: Layer) => void
) => {
  const PureLayer = (() => {
    switch (layer.key) {
      case "Conv2d":
        return function Conv2d({ tensor }: RenderProps) {
          const updateParams = (params: RequiredDeep<Conv2dParams>) =>
            updateLayer({ key: "Conv2d", params });
          const applyLayer = useConv2d(layer.params, updateParams);
          return applyLayer(tensor);
        };
      case "Sequential":
        return function Sequential({ tensor }: RenderProps) {
          const updateParams = (params: SequentialParams) =>
            updateLayer({ key: "Sequential", params });
          const applyLayer = useSequential(layer.params, updateParams);
          return applyLayer(tensor);
        };
      case "JustTensor":
        return function JustTensor({ tensor }: RenderProps) {
          return makeJustTensorApplyLayer(layer.params.name)(tensor);
        };
      default:
        exhaustiveChack(layer);
        throw new Error("unreacheable");
    }
  })();
  const onDuplicate = addLayer ? () => addLayer(clone(layer)) : undefined;
  return AddCommonsAlongAllLayers(PureLayer, onDuplicate);
};
