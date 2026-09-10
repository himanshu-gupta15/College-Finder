import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { savedCollegeService } from "@/services/savedCollege.service";
import { NextRequest } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collegeId: string }> }
) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return apiError("UNAUTHORIZED", "Please log in to manage saved colleges", 401);
    }

    const { collegeId } = await params;
    if (!collegeId) {
      return apiError("INVALID_COLLEGE_ID", "College ID parameter is required", 400);
    }

    await savedCollegeService.removeSavedCollege(session.userId, collegeId);

    return apiSuccess(null, "College removed from saved list successfully");
  } catch (error) {
    console.error("Error in DELETE /api/saved-colleges/[collegeId]:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to remove saved college", 500);
  }
}
