// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { Issue } from "./types.ts";

export class StructError extends Error {
  readonly issues: Issue[];
  constructor(
    issues: Iterable<Issue>,
    message?: string,
    options?: ErrorOptions,
  ) {
    const _issues = Array.from(issues);
    const issueMessage = _issues.map(toString).join("\n");

    message = (message ?? "") +
      (issueMessage ? "\n" + issueMessage : "");
    message = nest(message ?? "", "    ");

    super(message, options);
    this.issues = _issues;
  }

  override name = "StructError";
}

function toString({ message, paths }: Issue): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}

function nest(value: string, separator: string): string {
  return value.replaceAll("\n", `\n${separator}`);
}
