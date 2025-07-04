import type * as React from "react";
import type {MutableRefObject} from "react";

import {isFunction} from "@heroui/shared-utils";

export type ReactRef<T> = React.RefObject<T> | React.MutableRefObject<T> | React.Ref<T>;

/**
 * Assigns a value to a ref function or object
 *
 * @param ref the ref to assign to
 * @param value the value
 */
export function assignRef<T = any>(ref: ReactRef<T> | undefined, value: T) {
  if (ref == null) return;

  if (isFunction(ref)) {
    ref(value);

    return;
  }

  try {
    (ref as MutableRefObject<T>).current = value;
  } catch {
    throw new Error(`Cannot assign value '${value}' to ref '${ref}'`);
  }
}

/**
 * Combine multiple React refs into a single ref function.
 * This is used mostly when you need to allow consumers forward refs to
 * internal components
 *
 * @param refs refs to assign to value to
 */
export function mergeRefs<T>(...refs: (ReactRef<T> | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => assignRef(ref, node));
  };
}
