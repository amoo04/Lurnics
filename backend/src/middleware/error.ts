import type { ErrorHandler, NotFoundHandler } from "hono";

export class AppError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class ValidationError extends AppError {
  constructor(
    message = "Validation failed",
    public errors?: Record<string, string[]>,
  ) {
    super(message, 422, "VALIDATION_ERROR");
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, "RATE_LIMITED");
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(error instanceof ValidationError && error.errors && { errors: error.errors }),
      },
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: {
        message: "An unexpected error occurred",
        code: "INTERNAL_ERROR",
      },
    };
  }

  return {
    success: false,
    error: {
      message: "An unexpected error occurred",
      code: "UNKNOWN_ERROR",
    },
  };
}

// Hono intercepts thrown errors at the dispatch level where they occur,
// using the app's registered onError handler (default or app.onError()) —
// not by letting them bubble up through next() in app.use() middleware.
// So error-to-response conversion has to be wired through app.onError(),
// not a try/catch wrapping next().
export const onError: ErrorHandler = (error, c) => {
  console.error("Error:", error);
  const result = handleError(error);
  const status = error instanceof AppError ? error.status : 500;
  return c.json(result, status as 400 | 401 | 403 | 404 | 409 | 422 | 429 | 500);
};

export const notFound: NotFoundHandler = (c) => {
  return c.json({ success: false, error: { message: "Not found" } }, 404);
};
