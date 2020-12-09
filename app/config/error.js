import array from 'lodash/array';

export const HTTP_ERROR = Object.freeze({
  ACCESS_DENIED: 403,
  NOT_FOUND: 404,
  TIME_OUT: 402,
  BAD_REQUEST: 400,
  NOT_AUTHENTICATE: 401,
  INTERNAL_SERVER_ERROR: 500
});

const SYSTEM_ERROR = Object.freeze([
  'EACCES', 'EPERM'
]);

export function isSystemError(err) {
  return err && err.code && SYSTEM_ERROR.indexOf(err.code) >= 0;
}

export class HttpError extends Error {
  constructor(code, message, info) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.info = info;
  }
}

export const FIELD_ERROR = Object.freeze({
  INVALID: 'INVALID',
  EMAIL_NOT_ACTIVE: 'EMAIL_NOT_ACTIVE',
  EXISTED: 'EXISTED'
});

export class FieldError {
  constructor(name, code, message) {
    this.name = name;
    this.code = code;
    this.message = message;
  }
}

export class FormError extends HttpError {
  constructor(_errors) {
    super(HTTP_ERROR.BAD_REQUEST, 'Bad request');
    this.errors = array.concat([], _errors);
  }
}

export function badRequest(name, code, message) {
  return new FormError(new FieldError(name, code, message));
}
