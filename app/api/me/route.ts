import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return apiError("UNAUTHORIZED", "User is not authenticated", 401);
    }

    const user = await authService.getCurrentUser(session.userId);
    return apiSuccess(user, "User profile retrieved successfully");
  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      return apiError("USER_NOT_FOUND", "User account not found", 404);
    }
    console.error("Error in GET /api/me:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to retrieve user profile", 500);
  }
}
