export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

export function arrayOf<T>(
  input: unknown,
  guard: (_input: unknown) => boolean,
): input is T[] {
  if (!isArray(input)) {
    return false;
  }

  return input.every(guard);
}
