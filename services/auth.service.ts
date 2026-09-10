import { comparePassword, hashPassword, signToken } from "@/lib/auth";
import { LoginInput, SignupInput } from "@/lib/validations/auth.schema";
import { userRepository } from "@/repositories/user.repository";

export class AuthService {
  async signup(input: SignupInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { user, token };
  }

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    };
  }

  async getCurrentUser(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    return user;
  }
}

export const authService = new AuthService();
