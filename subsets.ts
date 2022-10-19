import { fail, Prover } from "./utils.ts";
import { ProvableSchema } from "./types.ts";

export function maximum(num: number): ProvableSchema<number, number> {
  return new Prover(maximum.name, function* (value) {
    if (num < value) {
      yield fail(
        `expected less than or equal to ${num}, but actual ${value}`,
      );
    }
  });
}

export function minimum(num: number): ProvableSchema<number, number> {
  return new Prover(minimum.name, function* (value) {
    if (num > value) {
      yield fail(
        `expected greater than or equal to ${num}, but actual ${value}`,
      );
    }
  });
}

export function maxSize(num: number): ProvableSchema<string, string> {
  return new Prover(maxSize.name, function* (value) {
    const size = [...value].length;
    if (num < size) {
      yield fail(
        `expected less than or equal to ${num} item, but actual ${value} item`,
      );
    }
  });
}

export function minSize(
  num: number,
): ProvableSchema<string, string> {
  return new Prover(minSize.name, function* (value) {
    const size = [...value].length;
    if (num > size) {
      yield fail(
        `expected greater than or equal to ${num} item, but actual ${value} item`,
      );
    }
  });
}
