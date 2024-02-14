import { type MatcherState } from ".";

/**
 * Asymmetric matcher to check the format of a JSON string.
 *
 *   expect({ foo: fooJson }).toEqual({
 *     foo: expect.jsonMatching(expected),
 *   })
 */
export function jsonMatching(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  this: MatcherState,
  received: string,
  expected: object
) {
  let pass = false;

  try {
    received = JSON.parse(received);
    pass = this.equals(received, expected);
  } catch (err) {} // eslint-disable-line no-empty

  return {
    pass,
    message: () => '',
  };
}
