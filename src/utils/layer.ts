import { PrimitiveLayerParams } from "@/type/layer";

export const paramsHasNoNull = <T extends PrimitiveLayerParams>(
  params: Record<keyof T, number | "">,
  optionalValidate?: (key: string, val: number) => void
): params is Record<keyof T, number> => {
  Object.entries(params).forEach(([key, val]) => {
    if (typeof val === "string") {
      throw new Error(`param (${key}) is null.`);
    } else if (optionalValidate) {
      optionalValidate(key, val);
    }
  });
  return true;
};
