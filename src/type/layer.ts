import { Conv2dParams } from "@/components/layers/sizeFuncs";
import { Size, Tensor } from "@/type/size";
import { K } from "vitest/dist/types-7cd96283";

export type Value = string | number | undefined;
type Param<T extends Value> = {
  name: string;
  val: T;
};

export const param = <Name extends string, T extends Value>(
  name: Name,
  val: T
) => ({ name, val });

export type ParamBase = object;
export type PrimitiveLayerParams<T extends Value> = Param<T>[];

export type OnClickTypes = (key: number) => ((val: string) => void) | undefined;

export type applyLayer<T extends Size> = (tensor?: Tensor<T>) => {
  renderLayer: () => JSX.Element;
  tensor?: Tensor<T>;
};

export type LayerKey = "Sequential" | "Conv2d";
type LayerFactory<K extends LayerKey, T extends ParamBase> = {
  key: K;
  params: T;
};

type SequentialLayer = LayerFactory<"Sequential", Layer[]>;

type Conv2dLayer = LayerFactory<"Conv2d", Conv2dParams>;

export type Layer = SequentialLayer | Conv2dLayer;

// pureFunction
export type Forward = (
  layer: Layer,
  tensor?: Tensor<Size>
) => Tensor<Size> | undefined;
// pureFunction
export type Clone = <L extends Layer>(layer: Layer) => L;
// pureFunction
export type Render = (layer: Layer) => () => JSX.Element;
