import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  } | null;
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      data,
      error: null,
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 400,
  code?: string,
  details?: unknown
) {
  return NextResponse.json<ApiResponse<null>>(
    {
      data: null,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

export function handleApiError(error: unknown) {
  // Handle Zod Validation Errors
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    const message = firstIssue ? `${firstIssue.path.join(".") || "Value"}: ${firstIssue.message}` : "Validation failed";
    return errorResponse(message, 400, "VALIDATION_ERROR", error.flatten());
  }

  // Handle Application Errors (AppError, ValidationError, etc.)
  if (error && typeof error === "object" && "statusCode" in error && "message" in error) {
    const err = error as { statusCode: number; message: string; code?: string; details?: unknown };
    return errorResponse(err.message, err.statusCode, err.code, err.details);
  }

  console.error("[Unhandled API Error]:", error);
  return errorResponse("Internal server error", 500, "INTERNAL_ERROR");
}
