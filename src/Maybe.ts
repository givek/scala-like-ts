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
    return this.isEmpty ? None.apply() : Some.apply(() => t(this.getVal));
  }

  flatMap<R>(t: (value: T) => Maybe<R>): Maybe<R> {
    return this.isEmpty ? None.apply() : t(this.getVal);
  }

  filter(p: (value: T) => boolean): Maybe<T> {
    return this.isEmpty
      ? None.apply()
      : p(this.getVal)
      ? Some.apply(() => this.getVal)
      : None.apply();
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

  toJSON() {
    return this.isDefined ? this.getVal : undefined;
  }
}

export class None extends Maybe<never> {
  private constructor() {
    super();
  }

  get getVal(): never {
    throw new Error("None.getVal");
  }

  static apply(): None {
    return new None();
  }
}

export class Some<T> extends Maybe<T> {
  private value: T;

  private constructor(value: T) {
    super();
    this.value = value;
  }

  get getVal(): T {
    return this.value;
  }

  static apply<S>(lazyV: () => S): Some<S> {
    const v = lazyV();

    return new Some(v);
  }
}
