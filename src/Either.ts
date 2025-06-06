import { Maybe, Some, None } from "./Maybe";

export abstract class Either<TL, TR> {
  abstract get isLeft(): boolean;

  abstract get isRight(): boolean;

  abstract getOrElse(defaultVal: TR): TR;

  abstract get swap(): Either<TR, TL>;

  abstract map<R>(f: (value: TR) => R): Either<TL, R>;

  abstract flatMap<R>(f: (value: TR) => Either<TL, R>): Either<TL, R>;

  abstract filterOrElse(p: (value: TR) => boolean, zero: TL): Either<TL, TR>;

  abstract get toMaybe(): Maybe<TR>;

  abstract match<X, Y>({
    caseLeft,
    caseRight,
  }: {
    caseLeft: (value: TL) => X;
    caseRight: (value: TR) => Y;
  }): X | Y;
}

export class Left<TL, TR> extends Either<TL, TR> {
  private value: TL;

  constructor(value: TL) {
    super();
    this.value = value;
  }

  get isLeft(): boolean {
    return true;
  }

  get isRight(): boolean {
    return false;
  }

  getOrElse(defaultVal: TR): TR {
    return defaultVal;
  }

  get swap(): Either<TR, TL> {
    return new Right(this.value);
  }

  map<R>(_: (value: TR) => R): Either<TL, R> {
    return this as unknown as Either<TL, R>;
  }

  flatMap<R>(_: (value: TR) => Either<TL, R>): Either<TL, R> {
    return this as unknown as Either<TL, R>;
  }

  filterOrElse(_p: (value: TR) => boolean, _zero: TL): Either<TL, TR> {
    return this;
  }

  get toMaybe(): Maybe<TR> {
    return new None();
  }

  match<X, Y>({
    caseLeft,
  }: {
    caseLeft: (value: TL) => X;
    caseRight: (value: TR) => Y;
  }): X | Y {
    return caseLeft(this.value);
  }
}

export class Right<TL, TR> extends Either<TL, TR> {
  private value: TR;

  constructor(value: TR) {
    super();
    this.value = value;
  }

  get isLeft(): boolean {
    return false;
  }

  get isRight(): boolean {
    return true;
  }

  getOrElse(_: TR): TR {
    return this.value;
  }

  get swap(): Either<TR, TL> {
    return new Left(this.value);
  }

  map<R>(f: (value: TR) => R): Either<TL, R> {
    return new Right(f(this.value));
  }

  flatMap<R>(f: (value: TR) => Either<TL, R>): Either<TL, R> {
    return f(this.value);
  }

  filterOrElse(p: (value: TR) => boolean, zero: TL): Either<TL, TR> {
    return p(this.value) ? this : new Left(zero);
  }

  get toMaybe(): Maybe<TR> {
    return new Some(this.value);
  }

  match<X, Y>({
    caseRight,
  }: {
    caseLeft: (value: TL) => X;
    caseRight: (value: TR) => Y;
  }): X | Y {
    return caseRight(this.value);
  }
}
