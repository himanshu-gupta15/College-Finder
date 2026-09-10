import { apiError, apiSuccess } from "@/lib/api-response";
import { COOKIE_NAME } from "@/lib/auth";
import { signupSchema } from "@/lib/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid registration details",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { user, token } = await authService.signup(validation.data);

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return apiSuccess({ user, token }, "Account created successfully", 201);
  } catch (error: any) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return apiError(
        "USER_ALREADY_EXISTS",
        "An account with this email address already exists",
        409
      );
    }
    console.error("Error in POST /api/auth/signup:", error);
    return apiError("INTERNAL_SERVER_ERROR", "Failed to create account", 500);
  }
}
