import 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Matcher<T extends (...args: any[]) => unknown> = Parameters<T> extends [unknown, ...infer U]
  ? (...args: U) => void
  : () => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MatcherState = ReturnType<any>;
// export type MatcherState = ReturnType<Vi.ExpectStatic['getState']>;
