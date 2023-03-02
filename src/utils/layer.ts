import { PrimitiveLayerParams } from "@/type/layer";

export const paramsHasNoNull = <
  T extends string | number,
  U extends PrimitiveLayerParams<T>
>(
  params: PrimitiveLayerParams<T | "">,
  optionalValidate?: (key: string, val: T) => void
): params is U => {
  params.forEach(({ name, val }) => {
    if (typeof val === "string" && val === "") {
      throw new Error(`param (${name}) is null.`);
    } else if (optionalValidate) {
      optionalValidate(name, val);
    }
  });
  return true;
};
