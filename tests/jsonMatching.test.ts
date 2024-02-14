import { expect, describe, test } from "vitest";
import { jsonMatching } from "../src/matchers/jsonMatching";

expect.extend({ jsonMatching });

describe("jsonMatching", () => {
  test("matches object", () => {
    expect(JSON.stringify({ foo: "bar" })).toEqual(
      expect.jsonMatching({
        foo: expect.any(String),
      })
    );

    expect(JSON.stringify({ foo: "bar", bar: "baz" })).toEqual(
      expect.jsonMatching(expect.objectContaining({ foo: "bar" }))
    );
  });

  test("matches array", () => {
    expect(JSON.stringify(["foo", "bar"])).toEqual(
      expect.jsonMatching(expect.arrayContaining(["bar", "foo"]))
    );
  });

  test("works inside arrayContaining()", () => {
    expect([1, JSON.stringify({ foo: "bar" })]).toEqual(
      expect.arrayContaining([expect.jsonMatching({ foo: "bar" })])
    );
  });
});
