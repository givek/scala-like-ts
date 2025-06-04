import { describe, expect, test } from "bun:test";
import { Maybe, None, Some } from "../index";

const someNumber = new Some(5);
const none = new None();

describe("isDefined", () => {
  test("isDefined should return true for Some", () => {
    expect(someNumber.isDefined).toBe(true);
  });

  test("isDefined should return false for None", () => {
    expect(none.isDefined).toBe(false);
  });
});

describe("isEmpty", () => {
  test("isEmpty should return false for Some", () => {
    expect(someNumber.isEmpty).toBe(false);
  });

  test("isEmpty should return true for None", () => {
    expect(none.isEmpty).toBe(true);
  });
});

describe("getVal", () => {
  test("Some.getVal should return the value inside Some", () => {
    const someBool = new Some(true);
    expect(someBool.getVal).toEqual(true);
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
    const someNums = new Some(nums);
    expect(someNums.getOrElse([])).toEqual(nums);
  });

  test("None.getOrElse should return the value provided to getOrElse", () => {
    expect(none.getOrElse([1, 2])).toEqual([1, 2]);
  });
});

describe("map", () => {
  test("Some.map should return the mapped result", () => {
    const someNum = new Some(2);
    const result = someNum.map((n) => n * 2);
    expect(result.isDefined).toBe(true);
    expect(result.getVal).toBe(4);
  });

  test("None.map should return None", () => {
    const result = none.map((a) => a * 3);
    expect(result.isDefined).toBe(false);
  });

  test("Some.map should throw Error if error is thrown inside the map", () => {
    const err = new Error("Some Error.");
    const someNum = new Some(2);
    expect(() => {
      someNum.map(() => {
        throw err;
      });
    }).toThrow(err);
  });

  test("None.map should return None, even if error is thrown inside the map", () => {
    const result = none.map(() => {
      throw new Error("Ignored error");
    });
    expect(result.isDefined).toBe(false);
  });
});

describe("flatMap", () => {
  test("Some.flatMap should return the mapped and flattened result", () => {
    const someNum = new Some(2);
    const result = new Some(someNum).flatMap((n) => n);
    expect(result).toBe(someNum);
  });

  test("None.flatMap should return None", () => {
    const result = none.flatMap((a) => new Some(a));
    expect(result.isDefined).toBe(false);
  });

  test("Some.flatMap should throw Error if error is thrown inside the flatMap", () => {
    const err = new Error("Some Error.");
    const someNum = new Some(2);
    expect(() => {
      someNum.flatMap(() => {
        throw err;
      });
    }).toThrow(err);
  });

  test("None.flatMap should return None, even if error is thrown inside the flatMap", () => {
    const result = none.flatMap(() => {
      throw new Error("Ignored error");
    });
    expect(result.isDefined).toBe(false);
  });
});

describe("filter", () => {
  test("Some.filter should return Some with same value if predicate holds", () => {
    const someNum = new Some(2);
    const result = someNum.filter((n) => n !== 4);
    expect(result.getVal).toBe(2);
  });

  test("Some.filter should return None if predicate does not hold", () => {
    const someNum = new Some(2);
    const result = someNum.filter((n) => n !== 2);
    expect(result.isDefined).toBe(false);
  });

  test("None.filter should return None", () => {
    const result = none.filter((a) => a === 3);
    expect(result.isDefined).toBe(false);
  });

  test("Some.filter should throw Error if predicate throws", () => {
    const err = new Error("Some Error.");
    const someNum = new Some(2);
    expect(() => {
      someNum.filter(() => {
        throw err;
      });
    }).toThrow(err);
  });

  test("None.filter should return None, even if predicate throws", () => {
    const result = none.filter(() => {
      throw new Error("Ignored");
    });
    expect(result.isDefined).toBe(false);
  });
});

describe("match", () => {
  const val = { foo: "bar" };
  const defaultVal = "default";

  test("None.match should execute caseNone", () => {
    const result = none.match({
      caseNone: () => defaultVal,
      caseSome: (v) => v,
    });
    expect(result).toBe(defaultVal);
  });

  test("Some.match should execute caseSome", () => {
    const someVal = new Some(val);
    const result = someVal.match({
      caseNone: () => "ignored",
      caseSome: (v) => v.foo,
    });
    expect(result).toBe("bar");
  });
});

describe("new Some", () => {
  test("new Some for undefined should return Some<undefined>", () => {
    const val = new Some(undefined);
    expect(val.getVal).toBeUndefined();
  });

  test("new Some for null should return Some<null>", () => {
    const val = new Some(null);
    expect(val.getVal).toBeNull();
  });

  test("new Some for number should return Some<number>", () => {
    const val = new Some(4);
    expect(val.getVal).toBe(4);
  });

  test("new Some for list should return Some<T[]>", () => {
    const pets = ["shiba inu", "cat", "red panda"];
    const val = new Some(pets);
    expect(val.getVal).toEqual(pets);
  });

  test("new Some for object should return Some<object>", () => {
    const person = { name: "John" };
    const val = new Some(person);
    expect(val.getVal).toEqual(person);
  });
});

describe("new None", () => {
  test("new None should return instance of None", () => {
    const n = new None();
    expect(n).toBeInstanceOf(None);
  });
});
