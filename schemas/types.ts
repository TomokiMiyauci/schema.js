import { Result, Schema, SuperTypeMap, TypeStr } from "../types.ts";
import { SchemaError } from "../errors.ts";
import { isSuccessResult } from "../asserts.ts";
import { isUndefined } from "../deps.ts";

export abstract class TypeSchema<
  SuperType extends TypeStr,
  T = SuperTypeMap[SuperType],
> implements Schema {
  protected abstract type: SuperType;

  protected abstract typeOf(value: unknown): value is SuperTypeMap[SuperType];

  protected validateType(
    value: unknown,
  ): Result<SuperTypeMap[SuperType]> {
    const result = this.typeOf(value);

    if (result) {
      return { data: value };
    }

    const actual = typeof value;
    const expected = this.type;
    const error = new SchemaError(
      `Invalid type. "${actual}" -> "${expected}"`,
      {
        actual,
        expected,
      },
    );

    return { errors: [error] };
  }

  validate(
    value: unknown,
  ): Result<T> {
    return this.validateType(value) as Result<T>;
  }
}

export abstract class SubTypeSchema<
  SuperType extends TypeStr,
  SubType extends SuperTypeMap[SuperType] = SuperTypeMap[SuperType],
> extends TypeSchema<SuperType, SubType> {
  constructor(protected subType?: SubType) {
    super();
  }

  protected abstract subTypeOf(
    value: SuperTypeMap[SuperType],
  ): value is SubType;

  protected validateSubType(
    value: SuperTypeMap[SuperType],
  ): Result<SubType> {
    const result = this.subTypeOf(value);

    if (result) {
      return { data: value };
    }

    const actualStr = value?.toString() ?? "unknown";
    const expectedStr = this.subType?.toString() ?? "unknown";
    return {
      errors: [
        new SchemaError(`Invalid subtype. "${actualStr}" -> "${expectedStr}"`, {
          actual: value,
          expected: this.subType,
        }),
      ],
    };
  }

  override validate(value: unknown): Result<SubType> {
    const result = this.validateType(value);

    if (isSuccessResult(result)) {
      if (isUndefined(this.subType)) {
        return result as Result<SubType>;
      }
      return this.validateSubType(result.data);
    }

    return { errors: result.errors };
  }
}
