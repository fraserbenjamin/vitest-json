// @ts-nocheck
import { expect } from "vitest";

const errorMarker = "__INTERNALERRORMARKER__";

/**
 * Vitest matcher that receives a JSON string and matches to a value.
 *
 *   expect(fooJson).toMatchJSON(expected)
 */

function toMatchJSON(received: string, expected: object) {
  const {
    matcherErrorMessage,
    RECEIVED_COLOR,
    printDiffOrStringify,
    printExpected,
    printReceived,
    stringify,
  } = this.utils;

  const hint = this.utils.matcherHint("toMatchJSON", undefined, undefined, {
    isNot: this.isNot,
    promise: this.promise,
  });

  if (typeof received !== "string") {
    throwError(
      matcherErrorMessage(
        hint,
        `${RECEIVED_COLOR("received")} value must be a valid JSON string`
      )
    );
  }

  try {
    received = JSON.parse(received);
  } catch (error) {
    const match = error.message.match(
      /Unexpected (\w+)(?: .)? in JSON at position (\d+)/
    );
    const index = match ? parseInt(match[2], 10) : received.length;
    const isEmpty = received.trim().length === 0;
    const message = isEmpty
      ? ""
      : match
      ? `Unexpected ${match[1]}: ${received[index]}`
      : "Unexpected end of string";
    throwError(
      matcherErrorMessage(
        hint,
        `${RECEIVED_COLOR(
          "received"
        )} value must be a valid JSON string. ${message}`,
        isEmpty
          ? "Received: " + RECEIVED_COLOR(stringify(received))
          : printJsonError(stringify(received), RECEIVED_COLOR, index + 1)
      )
    );
  }

  const pass = this.equals(received, expected);
  const message = pass
    ? () =>
        `${hint} \n\nExpected: not ${printExpected(expected)}` +
        (stringify(expected) !== stringify(received)
          ? `\nReceived:     ${printReceived(received)}`
          : "")
    : () =>
        `${hint} \n\n` +
        printDiffOrStringify(
          expected,
          received,
          "Expected",
          "Received",
          this.expand !== false
        );

  return { pass, message };
}

/**
 * Asymmetric matcher to check the format of a JSON string.
 *
 *   expect({ foo: fooJson }).toEqual({
 *     foo: expect.jsonMatching(expected),
 *   })
 */

function jsonMatching(received: string, expected: object) {
  let pass = false;
  try {
    received = JSON.parse(received);
    pass = this.equals(received, expected);
  } catch (err) {} // eslint-disable-line no-empty

  return { pass, message: () => "" };
}

expect.extend({ jsonMatching, toMatchJSON });

/**
 * Formats the JSON.parse error message
 */
function printJsonError(
  value: string,
  print: (input: string) => void,
  index: number
) {
  let message = `Received: `;

  const lines = value.split("\n");

  for (let i = 0, count = 0; i < lines.length; i++) {
    const line = lines[i];
    message += print(line) + "\n";
    if (index >= count && index <= count + line.length) {
      message += " ".repeat(index - count + (i === 0 ? 10 : 0)) + "^\n";
    }
    count += line.length + 1;
  }

  return message;
}

/**
 * Throws the errors removing the matcher from stack trace
 */
function throwError(message: string) {
  try {
    throw Error(errorMarker);
  } catch (err) {
    const stack = err.stack
      .slice(err.stack.indexOf(errorMarker) + errorMarker.length)
      .split("\n");

    for (let i = stack.length - 1; i > 0; i--) {
      // search for the "first" matcher call in the trace
      if (stack[i].includes("toMatchJSON")) {
        stack.splice(0, i + 1, message);
        break;
      }
    }

    const error = Error(message);
    error.stack = stack.join("\n");
    throw error;
  }
}
