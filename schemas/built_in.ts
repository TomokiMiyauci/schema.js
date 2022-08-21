import { SchemaImpl } from "./types.ts";
import { DataFlow } from "../utils.ts";
import { assertArray, assertObject } from "../asserts.ts";

/** Schema definition of built-in `Array`.
 *
 * ```ts
 * import { ArraySchema } from "https://deno.land/x/schema_js/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new ArraySchema(), value);
 * // value is `any[]`
 * ```
 */
export class ArraySchema extends SchemaImpl<any[]> {
  protected override dataFlow = new DataFlow(assertObject).define(assertArray);
}
