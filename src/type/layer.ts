import { Conv2dParams } from "@/components/layers/sizeFuncs";
import { Size, Tensor } from "@/type/size";

export type Value = string | number | undefined;
type Param<T extends Value> = {
  name: string;
  val: T;
};

export const param = <Name extends string, T extends Value>(
  name: Name,
  val: T
) => ({ name, val });

export type PrimitiveLayerParams<T extends Value> = Param<T>[];

export type OnClickTypes = (key: number) => ((val: string) => void) | undefined;

export type applyLayer<T extends Size> = (tensor?: Tensor<T>) => {
  renderLayer: () => JSX.Element;
  tensor?: Tensor<T>;
};

type Layer<T> = {
  params: T;
  clone: () => Layer<T>;
};

type SequentialParams = Layer<Layer<unknown>[]>;

type Conv2dLayer = Layer<Conv2dParams>;
