export const isValidStr = (str: unknown): str is string =>
  !!str && typeof str === "string" && str.length > 1;

export const namePattern = /^[\p{L}\p{N}\p{P} ]+$/u;

export function isValidName(name: string) {
  return isValidStr(name) && namePattern.test(name) && name.length <= 80;
}

// TODO: remove
export function sleep() {
  return new Promise((res) => {
    setTimeout(res, 500);
  });
}
