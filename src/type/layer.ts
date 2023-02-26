import { Size, Tensor } from "@/type/size";
import React from "react";

export type Value = {
  priority: number;
  value: string | number;
};
export type LayerParams = Record<string, Value>;

export type GetPriorityFunc<T extends Record<string, string | number>> = (
  // eslint-next-lint-disable no-unused-vars
  val: keyof T
) => number;

export type LayerComponent<T extends Size> = (tensor: Tensor<T>) => {
  layer: React.ReactElement;
  tensor: Tensor<T>;
};
