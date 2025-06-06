import { describe, expect, it } from "bun:test";
import { Either, Left, Right } from "../index";
import { Some, None } from "../index";

describe("Either", () => {
  describe("Left", () => {
    const leftValue = "Error Message";
    const leftInstance = new Left<string, number>(leftValue);

    it("should be an instance of Left and Either", () => {
      expect(leftInstance).toBeInstanceOf(Left);
      expect(leftInstance).toBeInstanceOf(Either);
    });

    it("should correctly report isLeft and isRight", () => {
      expect(leftInstance.isLeft).toBe(true);
      expect(leftInstance.isRight).toBe(false);
    });

    it("getOrElse should return the default value", () => {
      const defaultValue = 100;
      expect(leftInstance.getOrElse(defaultValue)).toBe(defaultValue);
    });

    it("swap should transform Left to Right", () => {
      const swapped = leftInstance.swap;
      expect(swapped).toBeInstanceOf(Right);
      expect(swapped.isRight).toBe(true);
      expect(swapped.getOrElse("default")).toBe(leftValue);
    });

    it("map should return the original Left instance", () => {
      const mapped = leftInstance.map((val) => val * 2);
      expect(mapped).toBeInstanceOf(Left);

      const matchedRes = mapped.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe(leftValue);
    });

    it("flatMap should return the original Left instance", () => {
      const flatMapped = leftInstance.flatMap((val) => new Right(val * 2));

      expect(flatMapped).toBeInstanceOf(Left);

      const matchedRes = flatMapped.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe(leftValue);
    });

    it("filterOrElse should return the original Left instance", () => {
      const filtered = leftInstance.filterOrElse(
        (val) => val > 10,
        "Filter Error"
      );

      expect(filtered).toBeInstanceOf(Left);

      const matchedRes = filtered.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe(leftValue);
    });

    it("toMaybe should return a None instance", () => {
      const maybe = leftInstance.toMaybe;

      expect(maybe).toBeInstanceOf(None);

      expect(maybe.isEmpty).toBe(true);
    });

    it("match should execute caseLeft and return its result", () => {
      const result = leftInstance.match({
        caseLeft: (error) => `Error: ${error}`,
        caseRight: (value) => `Success: ${value}`,
      });

      expect(result).toBe(`Error: ${leftValue}`);
    });
  });

  describe("Right", () => {
    const rightValue = 42;
    const rightInstance = new Right<string, number>(rightValue);

    it("should be an instance of Right and Either", () => {
      expect(rightInstance).toBeInstanceOf(Right);
      expect(rightInstance).toBeInstanceOf(Either);
    });

    it("should correctly report isLeft and isRight", () => {
      expect(rightInstance.isLeft).toBe(false);
      expect(rightInstance.isRight).toBe(true);
    });

    it("getOrElse should return the internal value", () => {
      const defaultValue = 100;
      expect(rightInstance.getOrElse(defaultValue)).toBe(rightValue);
    });

    it("swap should transform Right to Left", () => {
      const swapped = rightInstance.swap;

      expect(swapped).toBeInstanceOf(Left);

      expect(swapped.isLeft).toBe(true);

      const matchedRes = swapped.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe(rightValue);
    });

    it("map should apply the function and return a new Right", () => {
      const mapped = rightInstance.map((val) => val * 2);

      expect(mapped).toBeInstanceOf(Right);

      expect(mapped.getOrElse(0)).toBe(rightValue * 2);
    });

    it("flatMap should apply the function and return the result of the function", () => {
      const flatMappedSuccess = rightInstance.flatMap(
        (val) => new Right(val + 10)
      );

      expect(flatMappedSuccess).toBeInstanceOf(Right);

      expect(flatMappedSuccess.getOrElse(0)).toBe(rightValue + 10);

      const flatMappedFailure = rightInstance.flatMap(
        (val) => new Left(`Failed for ${val}`)
      );

      expect(flatMappedFailure).toBeInstanceOf(Left);

      const matchedRes = flatMappedFailure.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe(`Failed for ${rightValue}`);
    });

    it("filterOrElse should return Right if predicate is true", () => {
      const filtered = rightInstance.filterOrElse(
        (val) => val > 10,
        "Filter Error"
      );

      expect(filtered).toBeInstanceOf(Right);

      expect(filtered.getOrElse(0)).toBe(rightValue);
    });

    it("filterOrElse should return Left if predicate is false", () => {
      const filtered = rightInstance.filterOrElse(
        (val) => val < 10,
        "Filter Error"
      );

      expect(filtered).toBeInstanceOf(Left);

      const matchedRes = filtered.match({
        caseLeft: (e) => e,
        caseRight: (v) => v,
      });

      expect(matchedRes).toBe("Filter Error");
    });

    it("toMaybe should return a Some instance", () => {
      const maybe = rightInstance.toMaybe;

      expect(maybe).toBeInstanceOf(Some);

      expect(maybe.isDefined).toBe(true);

      expect(maybe.getOrElse(0)).toBe(rightValue);
    });

    it("match should execute caseRight and return its result", () => {
      const result = rightInstance.match({
        caseLeft: (error) => `Error: ${error}`,
        caseRight: (value) => `Success: ${value}`,
      });

      expect(result).toBe(`Success: ${rightValue}`);
    });
  });
});
