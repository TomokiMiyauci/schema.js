import { Checkable, CheckableStruct, DataType, StructIssue } from "./types.ts";
import {
  hasOwn,
  isBigint,
  isBoolean,
  isFunction,
  isNonNullable,
  isNumber,
  isObject,
  isString,
  PartialBy,
} from "./deps.ts";
import { is } from "./checks.ts";
import { Check, constructorName } from "./utils.ts";
import { IssueKind } from "./enums.ts";

export function number(): CheckableStruct<number> {
  return new Check(number.name, function* (input) {
    if (!isNumber(input)) {
      yield typeIssue("number", input);
    }
  });
}

export function string(): CheckableStruct<string> {
  return new Check(string.name, function* (input) {
    if (!isString(input)) {
      yield typeIssue("string", input);
    }
  });
}

export function boolean(): CheckableStruct<boolean> {
  return new Check(boolean.name, function* (input) {
    if (!isBoolean(input)) {
      yield typeIssue("boolean", input);
    }
  });
}

export function bigint(): CheckableStruct<bigint> {
  return new Check(bigint.name, function* (input) {
    if (!isBigint(input)) {
      yield typeIssue("bigint", input);
    }
  });
}

export function func(): CheckableStruct<Function> {
  return new Check(func.name, function* (input) {
    if (!isFunction(input)) {
      yield typeIssue("function", input);
    }
  });
}

export interface ObjectCheckableStruct {
  readonly [k: string]: Checkable<unknown>;
}

export function object<S extends ObjectCheckableStruct>(
  struct: S,
): CheckableStruct<S>;
export function object(): CheckableStruct<object>;
export function object(
  struct?: ObjectCheckableStruct,
): CheckableStruct<object> {
  return new Check(object.name, function* (input, context) {
    if (!isObject(input)) {
      return yield typeIssue("object", input);
    }

    for (const key in struct) {
      const paths = context.paths.concat(key);

      if (!hasOwn(key, input)) {
        yield { message: `property does not exist`, paths };
        continue;
      }

      yield* struct[key].check(input[key], { paths });
    }
  });
}

export function list<S extends CheckableStruct<unknown>>(
  structs: readonly S[],
): CheckableStruct<S[]> {
  return new Check(list.name, function* (value, context) {
    if (!Array.isArray(value)) {
      return yield {
        message: `expected Array, actual ${constructorName(value)}`,
      };
    }

    for (const key in value) {
      const isSatisfy = structs.some((schema) => is(schema, value[key]));

      if (!isSatisfy) {
        const names = structs.map(({ name }) => name).join(", ");
        const paths = context.paths.concat(key);

        yield {
          message: `none of the schemas are satisfied [${names}]`,
          paths,
        };
      }
    }
  });
}

export function or<S extends readonly CheckableStruct<unknown>[]>(
  ...structs: S
): CheckableStruct<S[number]> {
  return new Check(or.name, function* (input) {
    const valid = structs.some((struct) => is(struct, input));

    if (!valid) {
      const names = structs.map(({ name }) => name).join(", ");

      yield { message: `none of the schemas are satisfied [${names}]` };
    }
  });
}

export function record<K extends string, V>(
  key: CheckableStruct<K, {}>,
  value: CheckableStruct<V>,
): CheckableStruct<Record<K, V>, {}> {
  return new Check<Record<K, V>, {}>(record.name, function* (input, context) {
    for (const k in input) {
      yield* key.check(k, context);
      yield* value.check(input[k as keyof {}], context);
    }
  });
}

export function nonNullable(): CheckableStruct<{}> {
  return new Check(nonNullable.name, function* (value) {
    if (!isNonNullable(value)) {
      yield { message: `expected non nullable, but actual ${value}` };
    }
  });
}

function typeIssue(
  expected: DataType,
  actual: unknown,
): PartialBy<StructIssue, "paths"> {
  const act = typeof actual;
  return {
    kind: IssueKind.type,
    actual: act,
    expected,
    message: `expected ${expected}, actual ${act}`,
  };
}
