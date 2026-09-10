import { apiError, apiSuccess } from "@/lib/api-response";
import { COOKIE_NAME } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth.schema";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return apiError(
        "VALIDATION_ERROR",
        "Invalid login credentials format",
        400,
        validation.error.flatten().fieldErrors
      );
    }

    const { user, token } = await authService.login(validation.data);

    // Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return apiSuccess({ user, token }, "Logged in successfully", 200);
  } catch (error: any) {
    if (error.message === "INVALID_CREDENTIALS") {
      return apiError(
        "INVALID_CREDENTIALS",
        "Invalid email or password",
        401
      );
    }
    console.error("Error in POST /api/auth/login:", error);
    return apiError("INTERNAL_SERVER_ERROR", "An unexpected error occurred during login", 500);
  }
}
