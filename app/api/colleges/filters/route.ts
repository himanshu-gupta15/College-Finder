import { apiError, apiSuccess } from "@/lib/api-response";
import { collegeService } from "@/services/college.service";

export async function GET() {
  try {
    const filters = await collegeService.getFilterOptions();
    return apiSuccess(filters, "Filter options fetched successfully");
  } catch (error) {
    console.error("Error in GET /api/colleges/filters:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to fetch filter options", 500);
  }
}
