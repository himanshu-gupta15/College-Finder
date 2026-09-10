import { apiError, apiSuccess } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { collegeCreateSchema } from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const collegeType = searchParams.get("collegeType") || undefined;
    const state = searchParams.get("state") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "15", 10);

    const result = await collegeService.getAdminColleges({
      search,
      collegeType,
      state,
      page: isNaN(page) ? 1 : page,
      limit: isNaN(limit) ? 15 : limit,
    });

    return apiSuccess(
      result.colleges,
      "Admin colleges retrieved successfully",
      200,
      {
        ...result.pagination,
        ownershipStats: result.ownershipStats,
      }
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Admin privileges required", 403);
    }
    console.error("Error in GET /api/admin/colleges:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to retrieve colleges", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    const validation = collegeCreateSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid college data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const newCollege = await collegeService.createCollege(validation.data);
    return apiSuccess(newCollege, "College created successfully", 201);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Admin privileges required", 403);
    }
    if (error.message === "SLUG_ALREADY_EXISTS") {
      return apiError(
        "SLUG_ALREADY_EXISTS",
        "A college with this URL slug already exists. Please pick a unique slug.",
        409
      );
    }
    console.error("Error in POST /api/admin/colleges:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to create college", 500);
  }
}
