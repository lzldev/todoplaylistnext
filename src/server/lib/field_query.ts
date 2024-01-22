/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { type ZodSchema, ZodObject, ZodArray } from "zod";

export const zodParserIntoFieldsQuery = <
  T extends ZodSchema & { shape: any }, // Shape is not exposed in ZodTypes.
  K extends keyof T,
>(
  obj: T,
): string => {
  let res = "";
  const keys = Object.keys((obj as any).shape) as K[];

  for (const key of keys) {
    if (res !== "") {
      res += ",";
    }

    res += key as string;
    if (obj.shape[key] instanceof ZodObject) {
      res += `(${zodParserIntoFieldsQuery(obj.shape[key])})`;
    } else if (
      obj.shape[key] instanceof ZodArray &&
      obj.shape[key]._def.type instanceof ZodObject
    ) {
      res += `(${zodParserIntoFieldsQuery(obj.shape[key]._def.type)})`;
    }
  }
  return res;
};
