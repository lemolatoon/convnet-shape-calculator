import { useConv2d } from "@/components/layers/Conv2d";
import { makeJustTensorApplyLayer } from "@/components/layers/JustTensor";
import { Conv2dParams, MaxPool2dParams } from "@/components/layers/sizeFuncs";
import { useSequential } from "@/components/Sequential";
import {
  Layer,
  LayerComponent,
  OnClickTypes,
  ParamsBase,
  Render,
  RenderProps,
  SequentialParams,
} from "@/type/layer";
import { displaySize, Size } from "@/type/size";
import { exhaustiveCheck, RequiredDeep } from "@/type/util";
import { useState } from "react";
import styled from "styled-components";
import { BiDuplicate } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { MdCreateNewFolder } from "react-icons/md";
import { clone } from "@/utils/layer";
import { useMaxPool2d } from "@/components/layers/MaxPool2d";
import { CenteredModal } from "@/components/ui/Modal";
import { CreateLayer } from "@/components/CreateLayer";
import { useDebounce } from "@/hooks/useDebounce";

export type LayerProps<P extends ParamsBase> = {
  name: string;
  params: P;
  sizeBeforeApply?: Size;
  sizeAfterApply?: Size;
  errorMsg?: string;
  onClicks: OnClickTypes;
  edittableSize?: boolean;
};
const LayerParamBox = styled.div`
  display: grid;
  @media (max-width: 767px) {
    font-size: 0.75em;
    grid-template-columns: repeat(1, 1fr);
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
const ErrorMessage = styled.div`
  align-self: flex-end;
  @media (max-width: 767px) {
    font-size: 0.5em;
  }
  @media (min-width: 767px) and (max-width: 1200px) {
    font-size: 32px;
  }
  @media (min-width: 1200px) {
    font-size: 1em;
  }
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
    font-size: 16px;
  }
  @media (min-width: 767px) and (max-width: 1200px) {
    font-size: 32px;
  }
  @media (min-width: 1200px) {
    font-size: 2em;
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

type EditableSizeExprProps = {
  sizeBeforeApply?: Size;
  sizeAfterApply?: Size;
  editable?: boolean;
};
const EditableSizeExpr = ({
  sizeBeforeApply,
  sizeAfterApply,
  editable,
}: EditableSizeExprProps) => {
  const sizeExpression = (() => {
    if (sizeBeforeApply && sizeAfterApply) {
      return `${displaySize(sizeBeforeApply)} → ${displaySize(sizeAfterApply)}`;
    } else if (sizeAfterApply) {
      return displaySize(sizeAfterApply);
    } else if (sizeBeforeApply) {
      return `${displaySize(sizeBeforeApply)} →`;
    }
  })();
  return <SizeExpr>{sizeExpression}</SizeExpr>;
};

type DisplaySizeProps = {
  editable: boolean;
};
// const DisplaySize = ({edittable}: DisplaySizeProps) => {
// }

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

type DebouncedTransparentInputProps = {
  isReadonly: boolean;
  onChange: (value: string) => void;
  value: string;
  children?: React.ReactNode;
  intervalMilliSec?: number;
};
const DebouncedTransparentInput = ({
  isReadonly,
  onChange,
  value,
  children,
  intervalMilliSec,
}: DebouncedTransparentInputProps) => {
  const [text, setText] = useState(value);
  const [debouncedOnChange] = useDebounce(
    (value: string) => onChange(value),
    intervalMilliSec ?? 1000
  );

  return (
    <TransparentInput
      isReadonly={isReadonly}
      readOnly={isReadonly}
      onChange={(e) => {
        debouncedOnChange(e.target.value);
        setText(e.target.value);
      }}
      value={text}
      type="number"
    >
      {children}
    </TransparentInput>
  );
};

export const LayerBase = <P extends ParamsBase>({
  name,
  params,
  sizeBeforeApply,
  sizeAfterApply,
  onClicks,
  errorMsg,
  edittableSize,
}: LayerProps<P>) => {
  return (
    <GridWrapper>
      <Grid>
        <Name>{name}</Name>
        <EditableSizeExpr
          sizeBeforeApply={sizeBeforeApply}
          sizeAfterApply={sizeAfterApply}
          editable={edittableSize}
        />
        <LayerParamBox>
          {Object.entries(params).map(([name, val], key) => {
            const onClick = onClicks[name];
            const isReadonly = onClick === undefined;
            const handleChange = (value: string) => {
              onClick ? onClick(value) : undefined;
            };
            return (
              <LayerParam key={key}>
                {name}:
                <DebouncedTransparentInput
                  onChange={handleChange}
                  isReadonly={isReadonly}
                  value={`${val}`}
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

const StyledDeleteButton = styled(TiDelete)`
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
const StyledCreateButton = styled(MdCreateNewFolder)`
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
const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const LayerWrapper = styled.div``;
const LayerHOCBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  > ${ButtonBox} {
    grid-row-start: 0;
    grid-row-end: 1;
    grid-column-start: 0;
    grid-column-end: 1;
  }

  > ${LayerWrapper} {
    grid-row-start: 0;
    grid-row-end: 1;
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

const AddCommonsAlongAllLayers = (
  PureLayer: LayerComponent,
  onDuplicate?: () => void,
  onDelete?: () => void,
  onAddNewLayer?: (layer: Layer) => void
): LayerComponent =>
  function AppliedLayer({ tensor }: RenderProps) {
    const [modalShow, setModalShow] = useState(false);
    if (!onDuplicate && !onDelete) return <PureLayer tensor={tensor} />;
    return (
      <LayerHOCBox>
        <ButtonBox>
          {onDuplicate && <StyledDuplicateButton onClick={onDuplicate} />}
          {onDelete && <StyledDeleteButton onClick={onDelete} />}
          {onAddNewLayer && (
            <>
              <StyledCreateButton onClick={() => setModalShow(true)} />
              <CenteredModal show={modalShow} close={() => setModalShow(false)}>
                <CreateLayer
                  addNewLayer={(layer: Layer) => {
                    onAddNewLayer(layer);
                  }}
                />
              </CenteredModal>
            </>
          )}
        </ButtonBox>
        <LayerWrapper>
          <PureLayer tensor={tensor} />
        </LayerWrapper>
      </LayerHOCBox>
    );
  };

export const renderLayer: Render = (
  layer: Layer,
  updateLayer: (layer: Layer) => void,
  addLayer?: (layer: Layer) => void,
  deleteLayer?: () => void
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
          return makeJustTensorApplyLayer(layer.params.name, true)(tensor);
        };
      case "MaxPool2d":
        return function MaxPool2d({ tensor }: RenderProps) {
          const updateParams = (params: RequiredDeep<MaxPool2dParams>) =>
            updateLayer({ key: "MaxPool2d", params });
          const applyLayer = useMaxPool2d(layer.params, updateParams);
          return applyLayer(tensor);
        };
      default:
        exhaustiveCheck(layer);
        throw new Error("unreacheable");
    }
  })();
  const onDuplicate =
    addLayer && layer.noDuplicate !== true
      ? () => addLayer(clone(layer))
      : undefined;
  const onDelete =
    deleteLayer && layer.noDelete !== true ? () => deleteLayer() : undefined;
  return AddCommonsAlongAllLayers(PureLayer, onDuplicate, onDelete, addLayer);
};
