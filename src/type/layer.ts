import { Conv2dParams, MaxPool2dParams } from "@/components/layers/sizeFuncs";
import { Size, Tensor } from "@/type/size";
import { RequiredDeep } from "@/type/util";

export type OnClickTypes = Record<string, ((val: string) => void) | undefined>;

export type applyLayer<T extends Size> = (tensor?: Tensor<T>) => JSX.Element;

export const layerKeys = [
  "Sequential",
  "Conv2d",
  "JustTensor",
  "MaxPool2d",
] as const;
export type LayerKey = (typeof layerKeys)[number];

type OneLayer = { layer: Layer; id: number };
export type Value = OneLayer[] | string | number | boolean;
export type ParamsBase = Record<string, Value>;
type LayerFactory<K extends LayerKey, P extends ParamsBase> = {
  key: K;
  params: P;
  noDelete?: boolean;
  noDuplicate?: boolean;
};
export type SequentialParams = {
  layers: OneLayer[];
};
export type SequentialLayer = LayerFactory<"Sequential", SequentialParams>;

type Conv2dLayer = LayerFactory<"Conv2d", Conv2dParams>;

type MaxPool2dLayer = LayerFactory<"MaxPool2d", RequiredDeep<MaxPool2dParams>>;

type JustTensorLayer = LayerFactory<"JustTensor", { name: string }>;

export type Layer =
  | SequentialLayer
  | Conv2dLayer
  | MaxPool2dLayer
  | JustTensorLayer;

// pureFunction
export type Forward = (
  layer: Layer,
  tensor?: Tensor<Size>
) => Tensor<Size> | undefined;
// pureFunction
export type Clone = <L extends Layer>(layer: L) => L;

export type RenderProps = {
  tensor?: Tensor<Size>;
};
export type LayerComponent = (props: RenderProps) => JSX.Element;
// pureFunction
export type Render = (
  layer: Layer,
  updateLayer: (layer: Layer) => void,
  addLayer?: (layer: Layer) => void,
  deleteLayer?: () => void
) => LayerComponent;
