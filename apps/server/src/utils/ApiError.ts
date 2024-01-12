class ApiError extends Error {
  isOperational: boolean;
  statusCode: number;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = "",
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      // Not working in TypeScript
      // refer to https://github.com/microsoft/TypeScript/issues/3926
      // Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
