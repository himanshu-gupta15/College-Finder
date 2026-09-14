import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
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
  } catch (error) {
    return handleApiError(error, "Failed to retrieve college");
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
    const validatedData = collegeUpdateSchema.parse(body);

    const updated = await collegeService.updateCollege(id, validatedData);
    return apiSuccess(updated, "College updated successfully");
  } catch (error) {
    return handleApiError(error, "Failed to update college");
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
  } catch (error) {
    return handleApiError(error, "Failed to delete college");
  }
}
