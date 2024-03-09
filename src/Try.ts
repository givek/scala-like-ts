import { Either, Left, Right } from "./Either";
import { Maybe, None, Some } from "./Maybe";

export abstract class Try<T> {
  abstract get isSuccess(): boolean;

  abstract get isFailure(): boolean;

  abstract get getVal(): T;

  getOrElse(defaultVal: T): T {
    return this.isFailure ? defaultVal : this.getVal;
  }

  abstract map<R>(f: (value: T) => R): Try<R>;

  abstract flatMap<R>(f: (value: T) => Try<R>): Try<R>;

  abstract filter(p: (value: T) => boolean): Try<T>;

  abstract get failed(): Try<Error>;

  abstract get toMaybe(): Maybe<T>;

  abstract get toEither(): Either<Error, T>;

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

  static apply<S>(lazyV: () => S): Try<S> {
    try {
      return new Success(lazyV());
    } catch (e: unknown) {
      return typeof e === "string"
        ? new Failure(new Error(e))
        : e instanceof Error
          ? new Failure(e)
          : new Failure(new Error("Unknown!"));
    }
  }
}

export class Failure<T> extends Try<T> {
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

  map<R>(f: (value: T) => R): Try<R> {
    return this as unknown as Try<R>;
  }

  flatMap<R>(f: (value: T) => Try<R>): Try<R> {
    return this as unknown as Try<R>;
  }

  filter(_: (value: T) => boolean): Try<T> {
    return this;
  }

  get failed(): Try<Error> {
    return new Success(this.exception);
  }

  get toMaybe(): Maybe<T> {
    return new None();
  }

  get toEither(): Either<Error, T> {
    return new Left(this.exception);
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
    return new Success(f(this.getVal));
  }

  flatMap<R>(f: (value: T) => Try<R>): Try<R> {
    return f(this.getVal);
  }

  filter(p: (value: T) => boolean): Try<T> {
    return p(this.getVal)
      ? this
      : new Failure(new Error(`Predicate does not hold for ${this.getVal}`));
  }

  get failed(): Try<Error> {
    return new Failure(new Error("Success.failed"));
  }

  get toMaybe(): Maybe<T> {
    return new Some(this.getVal);
  }

  get toEither(): Either<Error, T> {
    return new Right(this.getVal);
  }
}
