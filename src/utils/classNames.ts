export const classNames = (...args: (string | boolean | undefined | null)[]) =>
  args.filter(Boolean).join(" ");
