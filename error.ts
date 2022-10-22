import { Issue } from "./types.ts";

export class SchemaError extends Error {
  readonly issues: Issue[];
  constructor(issues: Iterable<Issue>) {
    super();
    this.issues = Array.from(issues);

    const issueMessage = this.issues.map(({ message }) => message).join("\n");
    this.message = "one or more issues were detected" + "\n" + issueMessage;
  }

  override name = "SchemaError";
}
