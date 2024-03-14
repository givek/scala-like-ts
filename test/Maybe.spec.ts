import { describe, expect, test } from "bun:test";
import { Maybe, None, Some } from "../src/Maybe";

const someNumber = Some.apply(() => 5);

const none = None.apply();

describe("isDefined", () => {
  test("isDefined should return true for Some", () => {
    expect(someNumber.isDefined).toBe(true);
  });

  test("isDefined should return true for None", () => {
    expect(none.isDefined).toBe(false);
  });
});

describe("isEmpty", () => {
  test("isEmpty should return false for Some", () => {
    expect(someNumber.isEmpty).toBe(false);
  });

  test("isEmpty should return false for None", () => {
    expect(none.isEmpty).toBe(true);
  });
});

describe("Maybe.apply", () => {
  test("Maybe.apply for undefined should return None", () => {
    expect(Maybe.apply(() => undefined)).toEqual(None.apply());
  });

  test("Maybe.apply for null should return None", () => {
    expect(Maybe.apply(() => null)).toEqual(None.apply());
  });

  // TODO: more test cases which should return None

  test("Maybe.apply for number should return Some<number>", () => {
    const num = 4;
    expect(Maybe.apply(() => num)).toEqual(Some.apply(() => num));
  });

  test("Maybe.apply for list should return Some<T[]>", () => {
    const pets: string[] = ["shiba inu", "cat", "red panda"];
    expect(Maybe.apply(() => pets)).toEqual(Some.apply(() => pets));
  });

  test("Maybe.apply for list should return Some<T[]>", () => {
    const person = { name: "John" };
    expect(Maybe.apply(() => person)).toEqual(Some.apply(() => person));
  });
});

describe("Some.apply", () => {
  test("Some.apply for undefined should return Some<undefined>", () => {
    expect(Some.apply(() => undefined)).toEqual(Some.apply(() => undefined));
  });

  test("Some.apply for null should return Some<null>", () => {
    expect(Some.apply(() => null)).toEqual(Some.apply(() => null));
  });

  // TODO: more test cases which should return None

  test("Some.apply for number should return Some<number>", () => {
    const num = 4;
    expect(Some.apply(() => num)).toEqual(Some.apply(() => num));
  });

  test("Some.apply for list should return Some<T[]>", () => {
    const pets: string[] = ["shiba inu", "cat", "red panda"];
    expect(Some.apply(() => pets)).toEqual(Some.apply(() => pets));
  });

  test("Some.apply for list should return Some<T[]>", () => {
    const person = { name: "John" };
    expect(Some.apply(() => person)).toEqual(Some.apply(() => person));
  });
});

describe("None.apply", () => {
  test("None.apply should return None", () => {
    expect(None.apply()).toEqual(None.apply());
  });
});

describe("getVal", () => {
  test("Some.getVal should return the value inside Some", () => {
    const isTrue = true;

    const someBool = Some.apply(() => isTrue);

    expect(someBool.getVal).toEqual(isTrue);
  });

  test("None.getVal should throw `None.getVal` error", () => {
    expect(() => {
      none.getVal;
    }).toThrow(new Error("None.getVal"));
  });
});

describe("getOrElse", () => {
  test("Some.getOrElse should return the value inside Some", () => {
    const nums = [2, 3, 6];

    const someNums = Some.apply(() => nums);

    expect(someNums.getOrElse([])).toEqual(nums);
  });

  test("Some.getOrElse should return the value inside Some", () => {
    expect(none.getOrElse([])).toEqual([]);
  });
});

describe("map", () => {
  test("Some.map should return the mapped result", () => {
    const num = 2;

    const someNum = Some.apply(() => num);

    expect(someNum.map((n) => n * 2)).toEqual(Some.apply(() => num * 2));
  });

  test("None.map should return None", () => {
    expect(none.map((a) => a * 3)).toEqual(none);
  });

  const err = new Error("Some Error.");

  test("Some.map should throw Error if error is thrown inside the map", () => {
    const num = 2;

    const someNum = Some.apply(() => num);

    expect(() => {
      someNum.map((_) => {
        throw err;
      });
    }).toThrow(err);
  });

  test("None.map should return None, even if error is thrown inside the map", () => {
    expect(
      none.map((_) => {
        throw err;
      }),
    ).toEqual(none);
  });
});

describe("flatMap", () => {
  test("Some.flatMap should return the mapped and flattened result", () => {
    const someNum = Some.apply(() => 2);

    const someSomeNum = Some.apply(() => someNum);

    expect(someSomeNum.flatMap((n) => n)).toEqual(someNum);
  });

  test("None.map should return None", () => {
    expect(none.map((a) => a * 3)).toEqual(none);
  });
});
