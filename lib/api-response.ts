import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  [key: string]: unknown;
}

export function apiSuccess<T>(
  data: T,
  message = "Operation successful",
  status = 200,
  pagination?: PaginationMeta
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      ...(pagination ? { pagination } : {}),
    },
    { status }
  );
}

export function apiError(
  code: string,
  message: string,
  status = 400,
  details: unknown = null
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        details,
      },
    },
    { status }
  );
}

export function handleApiError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred"
) {
  if (error instanceof ZodError) {
    return apiError(
      "VALIDATION_ERROR",
      "Request validation failed",
      400,
      error.flatten().fieldErrors
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target.join(", ")
          : (error.meta?.target as string) || "field";
        return apiError(
          "CONFLICT",
          `A record with this ${target} already exists`,
          409
        );
      }
      case "P2025":
        return apiError(
          "NOT_FOUND",
          "The requested resource was not found",
          404
        );
      case "P2003":
        return apiError(
          "FOREIGN_KEY_CONSTRAINT_FAILED",
          "Related resource constraint violation",
          400
        );
      default:
        console.error("Prisma error:", error.code, error.message);
        return apiError("DATABASE_ERROR", "A database error occurred", 500);
    }
  }

  if (error instanceof Error) {
    switch (error.message) {
      case "UNAUTHORIZED":
        return apiError("UNAUTHORIZED", "Authentication required", 401);
      case "FORBIDDEN":
        return apiError("FORBIDDEN", "Admin privileges required", 403);
      case "NOT_FOUND":
      case "COLLEGE_NOT_FOUND":
        return apiError("NOT_FOUND", "College not found", 404);
      case "USER_NOT_FOUND":
        return apiError("NOT_FOUND", "User not found", 404);
      case "SLUG_ALREADY_EXISTS":
        return apiError(
          "SLUG_ALREADY_EXISTS",
          "A college with this URL slug already exists. Please pick a unique slug.",
          409
        );
      case "USER_ALREADY_EXISTS":
        return apiError(
          "USER_ALREADY_EXISTS",
          "An account with this email already exists",
          409
        );
      case "INVALID_CREDENTIALS":
        return apiError(
          "INVALID_CREDENTIALS",
          "Invalid email or password",
          401
        );
      case "ALREADY_REVIEWED":
        return apiError(
          "ALREADY_REVIEWED",
          "You have already submitted a review for this college",
          409
        );
      default:
        console.error("Application error:", error.message);
        return apiError("INTERNAL_SERVER_ERROR", fallbackMessage, 500);
    }
  }

  console.error("Unknown error:", error);
  return apiError("INTERNAL_SERVER_ERROR", fallbackMessage, 500);
}
