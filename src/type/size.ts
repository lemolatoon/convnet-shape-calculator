/*
 * For example,
 * `{ dims: [32, 3, 28, 28] }` is tensor.shape == torch.Size([32, 3, 28, 28])
 */
export type Size = number[];

export type Tensor<T extends Size> = {
  shape: T;
};

export function displaySize(size: Size) {
  return size.join("×");
}

export type Conv2dSize =
  | [number, number, number]
  | [number, number, number, number];

export type LayerFunction<T extends Size> = (size: T) => T;

export class SizeError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "SizeError";
  }
}
