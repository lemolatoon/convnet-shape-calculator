/*
 * For example,
 * `{ dims: [32, 3, 28, 28] }` is tensor.shape == torch.Size([32, 3, 28, 28])
 */
export type Size = {
  dims: number[];
};

export type LayerFunction<T extends Size> = (size: T) => T;

export class SizeError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "SizeError";
  }
}
