export {
  isBoolean,
  isEmpty,
  isFunction,
  isNull,
  isNumber,
  isPlainObject,
  isString,
  isSymbol,
  isUndefined,
} from "https://deno.land/x/isx@1.0.0-beta.19/mod.ts";

export type valueOf<T> = T[keyof T];
