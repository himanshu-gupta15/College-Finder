import { NextResponse } from "next/server";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
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
