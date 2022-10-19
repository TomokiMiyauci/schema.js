import { Failure } from "./types.ts";

export class SchemaError extends Error {
  failures: Failure[];
  constructor(failures: Iterable<Failure>) {
    super();
    this.failures = Array.from(failures);

    const failMessage = this.failures.map(({ message }) => message).join("\n");
    this.message = "One or more errors were detected." + "\n" + failMessage;
  }

  override name = "SchemaError";
}
