import { Left, Right, type Either } from "./Either";
import { Maybe, None, Some } from "./Maybe";

export abstract class Try<T> {
  abstract get isSuccess(): boolean;

  abstract get isFailure(): boolean;

  abstract get getVal(): T;

  getOrElse<R>(defaultVal: R): T | R {
    return this.isFailure ? defaultVal : this.getVal;
  }

  abstract map<R>(f: (value: T) => R): Try<R>;

  abstract flatMap<R>(f: (value: T) => Try<R>): Try<R>;

  abstract filter(p: (value: T) => boolean): Try<T>;

  abstract get failed(): Try<Error>;

  get toEither(): Either<Error, T> {
    return this.isSuccess
      ? new Right(this.getVal)
      : new Left(this.failed.getVal);
  }

  get toMaybe(): Maybe<T> {
    return this.isSuccess ? new Some(this.getVal) : new None();
  }

  match<X, Y>({
    successCase,
    failureCase,
  }: {
    successCase: (value: T) => X;
    failureCase: (exception: Error) => Y;
  }): X | Y {
    return this.isSuccess
      ? successCase(this.getVal)
      : failureCase(this.failed.getVal);
  }
}

export class Failure extends Try<never> {
  private exception: Error;

  constructor(exception: Error) {
    super();
    this.exception = exception;
  }

  get isSuccess(): boolean {
    return false;
  }

  get isFailure(): boolean {
    return true;
  }

  get getVal(): never {
    throw this.exception;
  }

  map<R>(_: (value: never) => R): Try<R> {
    return this as unknown as Try<R>;
  }

  flatMap<R>(_: (value: never) => Try<R>): Try<R> {
    return this as unknown as Try<R>;
  }

  filter(_: (value: never) => boolean): Try<never> {
    return this;
  }

  get failed(): Try<Error> {
    return new Success(this.exception);
  }
}

export class Success<T> extends Try<T> {
  private value: T;

  constructor(value: T) {
    super();
    this.value = value;
  }

  get isSuccess(): boolean {
    return true;
  }

  get isFailure(): boolean {
    return false;
  }

  get getVal(): T {
    return this.value;
  }

  map<R>(f: (value: T) => R): Try<R> {
    try {
      return new Success(f(this.getVal)); // Apply function f to the value inside Success
    } catch (error) {
      return error instanceof Error
        ? new Failure(error)
        : typeof error === "string"
        ? new Failure(new Error(error))
        : new Failure(new Error("Unknown error!"));
    }
  }

  flatMap<R>(f: (value: T) => Try<R>): Try<R> {
    try {
      return f(this.getVal); // Apply function f to the value inside Success
    } catch (error) {
      return error instanceof Error
        ? new Failure(error)
        : typeof error === "string"
        ? new Failure(new Error(error))
        : new Failure(new Error("Unknown error!"));
    }
  }

  filter(p: (value: T) => boolean): Try<T> {
    return p(this.getVal)
      ? this
      : new Failure(new Error(`Predicate does not hold for ${this.getVal}`));
  }

  get failed(): Try<Error> {
    return new Failure(new Error("Success.failed"));
  }
}
