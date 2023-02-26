import { Size, Tensor } from "@/type/size";
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

export type OnClickTypes<T extends Record<string, unknown>> = {
  [K in keyof T]: ((val: number) => void) | undefined;
};

export type GetPriorityFunc<T extends PrimitiveLayerParams> = (
  // eslint-next-lint-disable no-unused-vars
  val: keyof T
) => number;

export type LayerComponent<T extends Size> = (tensor: Tensor<T>) => {
  layer: React.ReactElement;
  tensor: Tensor<T>;
};
