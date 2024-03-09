export abstract class Maybe<T> {
  abstract get getVal(): T;

  get isDefined(): boolean {
    return this instanceof None ? false : true;
  }

  get isEmpty(): boolean {
    return !this.isDefined;
  }

  getOrElse(defaultVal: T): T {
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

  match<X, Y>({
    caseSome,
    caseNone,
  }: {
    caseSome: (val: T) => X;
    caseNone: () => Y;
  }): X | Y {
    return this.isEmpty ? caseNone() : caseSome(this.getVal);
  }

  static apply<S>(lazyV: () => S): Maybe<S> {
    const v = lazyV();

    if (v === undefined || v === null) {
      return new None();
    } else {
      return new Some(v);
    }
  }
}

export class None extends Maybe<never> {
  get getVal(): never {
    throw Error("None.getVal");
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
