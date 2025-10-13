export type PrimitiveTypeName =
  | "array"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "object";
export type ConstructorLike = new (...args: unknown[]) => unknown;

export function isOfType(
  data: unknown,
  type: PrimitiveTypeName | ConstructorLike
): boolean {
  switch (type) {
    case "array":
      return Array.isArray(data);
    case "boolean":
    case "function":
    case "number":
    case "string":
    case "object":
      return typeof data === type;
    default:
      return data instanceof type;
  }
}

export function isArray<T = unknown>(data: unknown): data is T[] {
  return isOfType(data, "array");
}

export function isBoolean(data: unknown): data is boolean {
  return isOfType(data, "boolean");
}

export function isFunction(
  data: unknown
): data is (...args: unknown[]) => unknown {
  return isOfType(data, "function");
}

export function isNullOrUndefined(data: unknown): data is null | undefined {
  return data === null || data === undefined;
}

export function isNumber(data: unknown): data is number {
  return isOfType(data, "number");
}

export function isObject(data: unknown): boolean {
  return isOfType(data, "object");
}

export function isPresent(value: unknown): boolean {
  return !isNullOrUndefined(value) && value !== "";
}

export function isString(data: unknown): data is string {
  return isOfType(data, "string");
}
