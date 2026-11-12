/** Joins class names, skipping falsy values. */
export const cx = (...c: Array<string | false | null | undefined | 0>): string => c.filter(Boolean).join(' ')
