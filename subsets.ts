import { Prover } from "./types.ts";
import { show } from "./utils.ts";

export function maximum(num: number): Prover<number, number> {
  return new Prover(function* (value) {
    if (num < value) {
      yield Error(`Exceed maximum number.
      Expected: ${show(num)}
      Actual: ${show(value)}`);
    }
  });
}

export function minimum(num: number): Prover<number, number> {
  return new Prover(function* (value) {
    if (num > value) {
      yield Error(`Exceed maximum number.
      Expected: ${num}
      Actual: ${show(value)}`);
    }
  });
}

export function maxSize(
  num: number,
): Prover<string, string> {
  return new Prover(function* (value) {
    const size = [...value].length;
    if (num < size) {
      yield Error(`Exceed maximum size.
      Expected: ${show(num)}
      Actual: ${show(size)}`);
    }
  });
}

export function minSize(
  num: number,
): Prover<string, string> {
  return new Prover(function* (value) {
    const size = [...value].length;
    if (num > size) {
      yield Error(`Exceed minimum size.
      Expected: ${show(num)}
      Actual: ${show(size)}`);
    }
  });
}
