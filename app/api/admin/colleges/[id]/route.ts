import { apiError, apiSuccess } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { collegeUpdateSchema } from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    if (!id) {
      return apiError("INVALID_ID", "College ID is required", 400);
    }

    const college = await collegeService.getCollegeById(id);
    if (!college) {
      return apiError("NOT_FOUND", "College not found", 404);
    }

    return apiSuccess(college, "College details retrieved successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Admin privileges required", 403);
    }
    console.error("Error in GET /api/admin/colleges/[id]:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to retrieve college", 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    if (!id) {
      return apiError("INVALID_ID", "College ID is required", 400);
    }

    const body = await req.json();
    const validation = collegeUpdateSchema.safeParse(body);

    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid college update data",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const updated = await collegeService.updateCollege(id, validation.data);
    return apiSuccess(updated, "College updated successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Admin privileges required", 403);
    }
    if (error.message === "COLLEGE_NOT_FOUND") {
      return apiError("NOT_FOUND", "College not found", 404);
    }
    if (error.message === "SLUG_ALREADY_EXISTS") {
      return apiError(
        "SLUG_ALREADY_EXISTS",
        "A college with this URL slug already exists. Please pick a unique slug.",
        409
      );
    }
    console.error("Error in PUT /api/admin/colleges/[id]:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to update college", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);

    const { id } = await params;
    if (!id) {
      return apiError("INVALID_ID", "College ID is required", 400);
    }

    await collegeService.deleteCollege(id);
    return apiSuccess(null, "College deleted successfully");
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return apiError("UNAUTHORIZED", "Authentication required", 401);
    }
    if (error.message === "FORBIDDEN") {
      return apiError("FORBIDDEN", "Admin privileges required", 403);
    }
    if (error.message === "COLLEGE_NOT_FOUND") {
      return apiError("NOT_FOUND", "College not found", 404);
    }
    console.error("Error in DELETE /api/admin/colleges/[id]:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to delete college", 500);
  }
}
