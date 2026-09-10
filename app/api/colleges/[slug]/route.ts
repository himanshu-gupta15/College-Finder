import { apiError, apiSuccess } from "@/lib/api-response";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return apiError("INVALID_SLUG", "College slug is required", 400);
    }

    let college = await collegeService.getCollegeBySlug(slug);

    // If not found by slug, attempt find by ID as fallback
    if (!college) {
      college = await collegeService.getCollegeById(slug);
    }

    if (!college) {
      return apiError(
        "COLLEGE_NOT_FOUND",
        `College with identifier '${slug}' was not found`,
        404
      );
    }

    return apiSuccess(college, "College details retrieved successfully");
  } catch (error) {
    console.error("Error in GET /api/colleges/[slug]:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to retrieve college details", 500);
  }
}
