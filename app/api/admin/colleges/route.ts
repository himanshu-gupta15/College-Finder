import { apiSuccess, handleApiError } from "@/lib/api-response";
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
  } catch (error) {
    return handleApiError(error, "Failed to retrieve colleges");
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);

    const body = await req.json();
    const validatedData = collegeCreateSchema.parse(body);

    const newCollege = await collegeService.createCollege(validatedData);
    return apiSuccess(newCollege, "College created successfully", 201);
  } catch (error) {
    return handleApiError(error, "Failed to create college");
  }
}
