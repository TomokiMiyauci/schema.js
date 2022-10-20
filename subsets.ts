import { Check } from "./utils.ts";
import { CheckableStruct } from "./types.ts";

export function maximum(num: number): CheckableStruct<number, number> {
  return new Check(maximum.name, function* (input) {
    if (num < input) {
      yield {
        message: `expected less than or equal to ${num}, but actual ${input}`,
      };
    }
  });
}

export function minimum(num: number): CheckableStruct<number, number> {
  return new Check(minimum.name, function* (input) {
    if (num > input) {
      yield {
        message:
          `expected greater than or equal to ${num}, but actual ${input}`,
      };
    }
  });
}

export function maxSize(num: number): CheckableStruct<string, string> {
  return new Check(maxSize.name, function* (input) {
    const size = [...input].length;
    if (num < size) {
      yield {
        message:
          `expected less than or equal to ${num} item, but actual ${input} item`,
      };
    }
  });
}

export function minSize(
  num: number,
): CheckableStruct<string, string> {
  return new Check(minSize.name, function* (input) {
    const size = [...input].length;
    if (num > size) {
      yield {
        message:
          `expected greater than or equal to ${num} item, but actual ${input} item`,
      };
    }
  });
}
