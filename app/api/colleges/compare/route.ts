import { apiError, apiSuccess } from "@/lib/api-response";
import { collegeService } from "@/services/college.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get("ids") || searchParams.get("slugs") || "";

    if (!idsParam.trim()) {
      return apiError(
        "MISSING_IDENTIFIERS",
        "Please provide college IDs or slugs to compare via 'ids' parameter",
        400
      );
    }

    const identifiers = idsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (identifiers.length === 0) {
      return apiError("NO_COLLEGES_SPECIFIED", "No valid college IDs provided", 400);
    }

    if (identifiers.length > 3) {
      return apiError(
        "MAX_COMPARISON_EXCEEDED",
        "You can compare at most 3 colleges at a time",
        400
      );
    }

    const colleges = await collegeService.getCollegesForComparison(identifiers);

    return apiSuccess(
      colleges,
      `Retrieved ${colleges.length} colleges for comparison`
    );
  } catch (error) {
    console.error("Error in GET /api/colleges/compare:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to fetch colleges for comparison", 500);
  }
}
