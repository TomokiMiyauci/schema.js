import { isString, isTruthy } from "./deps.ts";

export class SchemaError extends Error implements SchemaErrorOptions {
  actual: unknown;

  expected: unknown;

  path: ReadonlyArray<string | number>;

  children: ReadonlyArray<SchemaError>;

  constructor(message?: string, options?: SchemaErrorOptions) {
    super(message, options);

    this.actual = options?.actual;
    this.expected = options?.expected;
    this.path = Array.from(options?.path ?? []);
    this.children = Array.from(options?.children ?? []);

    if (message) {
      this.message = messageTemplate(this);
    }
  }

  override name = "SchemaError";
}

export interface SchemaErrorOptions extends ErrorOptions {
  actual?: unknown;
  expected?: unknown;

  path?: Iterable<string | number>;

  children?: Iterable<SchemaError>;
}

function messageTemplate({ message, children }: SchemaError): string {
  const group: Group = [
    message,
    children.map((child) => child.message),
  ];

  return nest(nest(group));
}

type Group<T = string> = T | Group[];

function nest(group: Group<string>): string {
  if (isString(group)) {
    return group;
  }

  return group.map(nest).filter(isTruthy).join("\n  ");
}
