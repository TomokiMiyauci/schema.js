export class SchemaError extends Error implements SchemaErrorOptions {
  actual: unknown;

  expected: unknown;

  path: ReadonlyArray<string>;

  children: ReadonlyArray<SchemaError>;

  constructor(message?: string, options?: SchemaErrorOptions) {
    super(message, options);

    this.actual = options?.actual;
    this.expected = options?.expected;
    this.path = Array.from(options?.path ?? []);
    this.children = Array.from(options?.children ?? []);

    if (message) {
      const msg = `${message}
  ${this.children.map((child) => child.message).join("\n")}`;
      this.message = msg;
    }
  }

  override name = "SchemaError";
}

export interface SchemaErrorOptions extends ErrorOptions {
  actual?: unknown;
  expected?: unknown;

  path?: Iterable<string>;

  children?: Iterable<SchemaError>;
}
