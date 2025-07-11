import { z } from "zod";

export abstract class Maybe<T> {
  abstract get getVal(): T;

  get isDefined(): boolean {
    return this instanceof None ? false : true;
  }

  get isEmpty(): boolean {
    return !this.isDefined;
  }

  getOrElse<R>(defaultVal: R): T | R {
    return this.isEmpty ? defaultVal : this.getVal;
  }

  map<R>(t: (value: T) => R): Maybe<R> {
    return this.isEmpty ? new None() : new Some(t(this.getVal));
  }

  flatMap<R>(t: (value: T) => Maybe<R>): Maybe<R> {
    return this.isEmpty ? new None() : t(this.getVal);
  }

  filter(p: (value: T) => boolean): Maybe<T> {
    return this.isEmpty
      ? new None()
      : p(this.getVal)
        ? new Some(this.getVal)
        : new None();
  }

  toJSON(): T | undefined {
    return this.isEmpty ? undefined : this.getVal;
  }

  match<X, Y>({
    caseSome,
    caseNone,
  }: {
    caseSome: (val: T) => X;
    caseNone: () => Y;
  }): X | Y {
    return this.isEmpty ? caseNone() : caseSome(this.getVal);
  }
}

export class None extends Maybe<never> {
  constructor() {
    super();
  }

  get getVal(): never {
    throw new Error("None.getVal");
  }
}

export class Some<T> extends Maybe<T> {
  private value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  get getVal(): T {
    return this.value;
  }
}

/**
 * Creates a Zod schema that validates a value and transforms it into a Maybe<T>.
 * It expects the input JSON to be either the underlying type T or null/undefined.
 *
 * @param schema The Zod schema for the underlying type T.
 * @returns A Zod schema that outputs Maybe<T>.
 */
export function zMaybe<T>(schema: z.ZodType<T>): z.ZodType<Maybe<T>> {
  return z
    .union([schema, z.null(), z.undefined()]) // Allow the actual type, null, or undefined
    .transform((val) => {
      if (val === null || val === undefined) {
        return new None() as Maybe<T>; // Cast for type safety, as None<never> needs to be Maybe<T>
      }
      return new Some(val);
    });
}

// --- Example Usage with zMaybe helper ---

// const postSchema = z.object({
//   title: z.string(),
//   content: zMaybe(z.string()), // This field is Maybe<string>
//   authorId: zMaybe(z.number().int()), // This field is Maybe<number>
//   createdAt: z.string().datetime(), // Assuming incoming date is string, then maybe transform to Date object if needed
// });
