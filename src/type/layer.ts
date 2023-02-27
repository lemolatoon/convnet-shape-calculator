import { Size, Tensor } from "@/type/size";
import { AddEmptyString } from "@/utils/object";
import React from "react";

export type Value = {
  priority: number;
  value: number;
};
export type PrimitiveLayerParams = Record<string, number>;
export type NormalizedPrimitiveLayerParams<T extends PrimitiveLayerParams> = {
  [K in keyof Required<T>]: string;
};
export type LayerParams<T extends PrimitiveLayerParams> = {
  [K in keyof Required<T>]: { priority: number; value: number };
};

export type LayerParamsWithEmptyString<T extends PrimitiveLayerParams> = {
  [K in keyof Required<T>]: { priority: number; value: number | "" };
};

export type OnClickTypes<T extends Record<string, unknown>> = (
  key: keyof T
) => ((val: string) => void) | undefined;

export type GetPriorityFunc<T extends AddEmptyString<PrimitiveLayerParams>> = (
  // eslint-next-lint-disable no-unused-vars
  val: keyof T
) => number;

export type LayerComponent<T extends Size> = (tensor?: Tensor<T>) => {
  layer: React.ReactElement;
  tensor?: Tensor<T>;
};
