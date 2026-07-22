import { Controller, Post, Body, Get, Headers } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

// Simple token-based auth for demo purposes
const tokens = new Map<string, string>(); // token -> userId

function generateToken(): string {
  return `nn_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

@Controller("v1/auth")
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      return { error: "Email and password required" };
    }
    try {
      const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
      if (existing) return { error: "Email already registered" };

      const id = `user-${Date.now()}`;
      await this.createUser(id, body.email);
      const token = generateToken();
      tokens.set(token, id);
      return { token, user: { id, email: body.email } };
    } catch {
      return { error: "Registration failed" };
    }
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email) return { error: "Email required" };
    try {
      const user = await this.prisma.user.findUnique({ where: { email: body.email } });
      if (!user) {
        // Auto-register for demo
        const id = `user-${Date.now()}`;
        await this.createUser(id, body.email);
        const token = generateToken();
        tokens.set(token, id);
        return { token, user: { id, email: body.email }, created: true };
      }
      const token = generateToken();
      tokens.set(token, user.id);
      return { token, user: { id: user.id, email: user.email } };
    } catch {
      return { error: "Login failed" };
    }
  }

  @Get("me")
  async me(@Headers("authorization") auth: string) {
    const token = auth?.replace("Bearer ", "");
    const userId = token ? tokens.get(token) : null;
    if (!userId) return { user: null };
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      return { user: user ? { id: user.id, email: user.email } : null };
    } catch {
      return { user: null };
    }
  }

  private async createUser(id: string, email: string) {
    try {
      await this.prisma.$executeRawUnsafe(
        `INSERT INTO User (id, email, createdAt) VALUES (?, ?, ?)`,
        id, email, new Date().toISOString()
      );
    } catch {
      // User might already exist
    }
  }
}
