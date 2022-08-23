import { assertSchema, StringSchema } from "./mod.ts";
import { z } from "https://deno.land/x/zod@v3.18.0/mod.ts";

Deno.bench("schema.js", { group: "initialize" }, () => {
  new StringSchema();
});

Deno.bench("zod", { group: "initialize" }, () => {
  z.string();
});

const schema = new StringSchema();

Deno.bench(
  "schema.js",
  { group: "simple validation" },
  () => {
    assertSchema(schema, "");
  },
);

const zodSchema = z.string();

Deno.bench(
  "zod",
  { group: "simple validation" },
  () => {
    zodSchema.safeParse("");
  },
);
