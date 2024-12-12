/// https://github.com/Tresjs/tres/blob/main/src/utils/is.ts

export function und(u: unknown) {
  return typeof u === 'undefined'
}

export function arr(u: unknown) {
  return Array.isArray(u)
}

export function num(u: unknown): u is number {
  return typeof u === 'number'
}

export function str(u: unknown): u is string {
  return typeof u === 'string'
}

export function bool(u: unknown): u is boolean {
  return u === true || u === false
}

export function fun(u: unknown): u is (...args: any[]) => any {
  return typeof u === 'function'
}

export function obj(u: unknown): u is Record<string | number | symbol, unknown> {
  return u === Object(u) && !arr(u) && !fun(u)
}