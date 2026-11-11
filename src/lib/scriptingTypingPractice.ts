export function isScriptingTypingComplete(input: string, target: string): boolean {
  return target.length > 0 && input === target;
}
