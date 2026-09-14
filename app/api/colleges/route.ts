import { apiSuccess, handleApiError } from "@/lib/api-response";
import { collegeQuerySchema } from "@/lib/validations/college.schema";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validatedQuery = collegeQuerySchema.parse(rawParams);
    const { colleges, pagination } = await collegeService.getColleges(validatedQuery);

    return apiSuccess(colleges, "Colleges retrieved successfully", 200, pagination);
  } catch (error) {
    return handleApiError(error, "An unexpected error occurred while fetching colleges");
  }
}
