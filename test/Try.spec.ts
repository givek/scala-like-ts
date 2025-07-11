import { Success, Failure, Try } from "../index";
import { Some } from "../index";
import { describe, expect, test, beforeEach } from "bun:test";

// Test suite for the Try class
describe("Try class", () => {
  describe("Success", () => {
    let successInstance: Try<number>;

    beforeEach(() => {
      successInstance = new Success(42);
    });

    test("should return true for isSuccess", () => {
      expect(successInstance.isSuccess).toBe(true);
    });

    test("should return false for isFailure", () => {
      expect(successInstance.isFailure).toBe(false);
    });

    test("should return the value using getVal", () => {
      expect(successInstance.getVal).toBe(42);
    });

    test("should return the value with getOrElse when successful", () => {
      expect(successInstance.getOrElse(0)).toBe(42);
    });

    test("should apply a function with map", () => {
      const mappedInstance = successInstance.map((x) => x + 1);
      expect(mappedInstance.getVal).toBe(43);
    });

    test("should apply a function with flatMap", () => {
      const flatMappedInstance = successInstance.flatMap(
        (x) => new Success(x * 2),
      );
      expect(flatMappedInstance.getVal).toBe(84);
    });

    test("should return a filtered success when predicate passes", () => {
      const filteredInstance = successInstance.filter((x) => x === 42);
      expect(filteredInstance.getVal).toBe(42);
    });

    test("should return a failure when predicate fails", () => {
      const filteredInstance = successInstance.filter((x) => x !== 42);
      expect(filteredInstance).toBeInstanceOf(Failure);
    });

    test("should convert to Maybe", () => {
      const maybeInstance = successInstance.toMaybe;
      expect(maybeInstance).toBeInstanceOf(Some);
      expect(maybeInstance.getVal).toBe(42);
    });

    test("should match with successCase", () => {
      const result = successInstance.match({
        successCase: (value) => value * 2,
        failureCase: (error) => 0,
      });
      expect(result).toBe(84);
    });
  });

  describe("Failure", () => {
    let failureInstance: Try<never>;

    beforeEach(() => {
      failureInstance = new Failure(new Error("Something went wrong"));
    });

    test("should return false for isSuccess", () => {
      expect(failureInstance.isSuccess).toBe(false);
    });

    test("should return true for isFailure", () => {
      expect(failureInstance.isFailure).toBe(true);
    });

    test("should throw an error for getVal", () => {
      expect(() => failureInstance.getVal).toThrow(
        new Error("Something went wrong"),
      );
    });

    test("should return the default value with getOrElse", () => {
      expect(failureInstance.getOrElse(0)).toBe(0);
    });

    test("should map to another failure", () => {
      const mappedInstance = failureInstance.map((x) => x);
      expect(mappedInstance).toBeInstanceOf(Failure);
    });

    test("should flatMap to another failure", () => {
      const flatMappedInstance = failureInstance.flatMap(
        (x) => new Failure(new Error("New error")),
      );
      expect(flatMappedInstance).toBeInstanceOf(Failure);
    });

    test("should filter to another failure", () => {
      const filteredInstance = failureInstance.filter((x) => x === 42);
      expect(filteredInstance).toBeInstanceOf(Failure);
    });

    test("should return the failed Try", () => {
      const failed = failureInstance.failed;
      expect(failed).toBeInstanceOf(Success);
      expect(failed.getVal.message).toBe("Something went wrong");
    });

    test("should match with failureCase", () => {
      const result = failureInstance.match({
        successCase: (value) => value,
        failureCase: (error) => error.message,
      });
      expect(result).toBe("Something went wrong");
    });
  });

  describe("General Try Behavior", () => {
    test("should chain Success instances correctly", () => {
      const result = new Success(10)
        .flatMap((x) => new Success(x + 5))
        .map((x) => x * 2);
      expect(result.getVal).toBe(30);
    });

    test("should handle Failure in chain correctly", () => {
      const result = new Success(10)
        .flatMap((_) => new Failure(new Error("Error in chain")))
        .map((x) => x * 2);

      expect(result).toBeInstanceOf(Failure);
      expect(() => result.getVal).toThrow(new Error("Error in chain"));
    });

    test("should return Failure if an error is throw inside Success map", () => {
      const helloSuccess = new Success("hello");

      const result = helloSuccess.map((_) => {
        throw new Error("Hello Error");
      });

      expect(result).toBeInstanceOf(Failure);
      expect(() => result.getVal).toThrow(new Error("Hello Error"));
    });

    test("should return Failure if an error is throw inside Success flatMap", () => {
      const helloSuccess = new Success("hello");

      const result = helloSuccess.flatMap((_) => {
        throw new Error("Hello Error");
      });

      expect(result).toBeInstanceOf(Failure);
      expect(() => result.getVal).toThrow(new Error("Hello Error"));
    });

    test("should match with both success and failure cases", () => {
      const resultSuccess = new Success(5).match({
        successCase: (value) => value + 1,
        failureCase: (_) => 0,
      });
      const resultFailure = new Failure(new Error("Fail")).match({
        successCase: (value) => value + 1,
        failureCase: (_) => 0,
      });
      expect(resultSuccess).toBe(6);
      expect(resultFailure).toBe(0);
    });
  });
});
