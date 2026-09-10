import { apiError, apiSuccess } from "@/lib/api-response";
import { collegeQuerySchema } from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validation = collegeQuerySchema.safeParse(rawParams);
    if (!validation.success) {
      return apiError(
        "INVALID_QUERY_PARAMETERS",
        "Query parameters validation failed",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { colleges, pagination } = await collegeService.getColleges(validation.data);

    return apiSuccess(colleges, "Colleges retrieved successfully", 200, pagination);
  } catch (error) {
    console.error("Error in GET /api/colleges:", error);
    return apiError("INTERNAL_SERVER_ERROR", "An unexpected error occurred while fetching colleges", 500);
  }
}
