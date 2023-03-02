import { Conv2dParams, MaxPool2dParams } from "@/components/layers/sizeFuncs";
import { Size, Tensor } from "@/type/size";
import { RequiredDeep } from "@/type/util";

export type Value = string | number | boolean | undefined;
type Param<T extends Value> = {
  name: string;
  val: T;
};

export const param = <Name extends string, T extends Value>(
  name: Name,
  val: T
) => ({ name, val });

export type ParamBase = object;
// type Tuple<Type, Length extends number> = ComputeTuple<Type, Length, []>;
// type ComputeTuple<
//   Type,
//   Length extends number,
//   Tail extends Type[],
// > = Tail['length'] extends Length
//   ? Tail
//   : ComputeTuple<Type, Length, [Type, ...Tail]>;
export type PrimitiveLayerParams<T extends Value> = Param<T>[];

export type OnClickTypes = (key: number) => ((val: string) => void) | undefined;

export type applyLayer<T extends Size> = (tensor?: Tensor<T>) => JSX.Element;

export type LayerKey = "Sequential" | "Conv2d" | "JustTensor" | "MaxPool2d";
type LayerFactory<K extends LayerKey, T extends ParamBase> = {
  key: K;
  params: T;
  noDelete?: boolean;
  noDuplicate?: boolean;
};

export type SequentialParams = { layer: Layer; id: number }[];
export type SequentialLayer = LayerFactory<"Sequential", SequentialParams>;

type Conv2dLayer = LayerFactory<"Conv2d", RequiredDeep<Conv2dParams>>;

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
