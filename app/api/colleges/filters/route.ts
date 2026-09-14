import { apiError, apiSuccess } from "@/lib/api-response";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state") || undefined;
    const filters = await collegeService.getFilterOptions(state);
    return apiSuccess(filters, "Filter options fetched successfully");
  } catch (error) {
    console.error("Error in GET /api/colleges/filters:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to fetch filter options", 500);
  }
}
