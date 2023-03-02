// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
export function exhaustiveChack(_val: never) {}

export type RequiredDeep<T> = {
  [P in keyof T]-?: Required<T[P]>;
};
