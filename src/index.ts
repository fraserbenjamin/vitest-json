import { type Matcher } from './matchers';
import { jsonMatching } from './matchers/jsonMatching';
import { expect } from 'vitest';

export {
    jsonMatching,
};

export interface Matchers {
    jsonMatching: Matcher<typeof jsonMatching>;
}

expect.extend({ jsonMatching });
