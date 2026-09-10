import { apiError, apiSuccess } from "@/lib/api-response";
import { getSessionUser } from "@/lib/auth";
import { saveCollegeSchema } from "@/lib/validations/auth.schema";
import { savedCollegeService } from "@/services/savedCollege.service";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return apiError("UNAUTHORIZED", "Please log in to view your saved colleges", 401);
    }

    const saved = await savedCollegeService.getSavedColleges(session.userId);
    return apiSuccess(saved, "Saved colleges retrieved successfully");
  } catch (error) {
    console.error("Error in GET /api/saved-colleges:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to retrieve saved colleges", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session) {
      return apiError("UNAUTHORIZED", "Please log in to save colleges", 401);
    }

    const body = await req.json();
    const validation = saveCollegeSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid college ID provided",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const result = await savedCollegeService.saveCollege(
      session.userId,
      validation.data.collegeId
    );

    return apiSuccess(result, "College saved to profile successfully", 201);
  } catch (error: any) {
    if (error.message === "COLLEGE_NOT_FOUND") {
      return apiError("COLLEGE_NOT_FOUND", "The college to save was not found", 404);
    }
    console.error("Error in POST /api/saved-colleges:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to save college", 500);
  }
}
