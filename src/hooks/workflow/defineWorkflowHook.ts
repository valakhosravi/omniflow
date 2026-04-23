import type { FieldValues } from "react-hook-form";

/**
 * Generic factory for workflow hooks. Preserves full return-type inference.
 *
 * @example
 * ```ts
 * export const useMyWorkflow = defineWorkflowHook<MyData>()(
 *   () => {
 *     return { title, actions, isInitialDataLoading, requestId, data };
 *   },
 * );
 * ```
 */
export function defineWorkflowHook<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TData = unknown,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TForm extends FieldValues = FieldValues,
>() {
  return function <TResult>(hook: () => TResult): () => TResult {
    return hook;
  };
}
