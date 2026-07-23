import { Controller, Post, Body, Get, Put, Headers, Req, Res } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import * as path from "path";
import * as fs from "fs";

const tokens = new Map<string, string>();

function generateToken(): string {
  return "nn_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
}

const avatarDir = path.resolve(__dirname, "..", "..", "..", "..", "..", "..", "..", "..", "apps", "web", "public", "avatars");
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

function toUser(row: any) {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    nickname: row.nickname || "",
    avatar: row.avatar || "",
    gender: row.gender || "",
    bio: row.bio || ""
  };
}

@Controller("v1/auth")
export class AuthController {
  constructor(private readonly prisma: PrismaService) {}

  @Post("register")
  async register(@Body() body: { email: string; password: string; nickname?: string }) {
    if (!body.email || !body.password) return { error: "Email and password required" };
    try {
      const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
      if (existing) return { error: "Email already registered" };
      const id = "user-" + Date.now();
      const nickname = body.nickname || body.email.split("@")[0];
      const now = new Date().toISOString();
      await this.prisma.$executeRawUnsafe(
        "INSERT INTO User (id, email, nickname, avatar, gender, bio, createdAt) VALUES (?,?,?,?,?,?,?)",
        id, body.email, nickname, "", "", "", now
      );
      const token = generateToken();
      tokens.set(token, id);
      return { token, user: { id, email: body.email, nickname, avatar: "", gender: "", bio: "" } };
    } catch { return { error: "Registration failed" }; }
  }

  @Post("login")
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email) return { error: "Email required" };
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>("SELECT * FROM User WHERE email = ?", body.email);
      let user = rows?.[0] || null;
      if (!user) {
        const id = "user-" + Date.now();
        const nickname = body.email.split("@")[0];
        const now = new Date().toISOString();
        await this.prisma.$executeRawUnsafe(
          "INSERT INTO User (id, email, nickname, avatar, gender, bio, createdAt) VALUES (?,?,?,?,?,?,?)",
          id, body.email, nickname, "", "", "", now
        );
        const token = generateToken();
        tokens.set(token, id);
        return { token, user: { id, email: body.email, nickname, avatar: "", gender: "", bio: "" }, created: true };
      }
      const token = generateToken();
      tokens.set(token, user.id);
      return { token, user: toUser(user) };
    } catch { return { error: "Login failed" }; }
  }

  @Get("me")
  async me(@Headers("authorization") auth: string) {
    const token = auth?.replace("Bearer ", "");
    const userId = token ? tokens.get(token) : null;
    if (!userId) return { user: null };
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>("SELECT * FROM User WHERE id = ?", userId);
      return { user: toUser(rows?.[0]) };
    } catch { return { user: null }; }
  }

  @Put("profile")
  async updateProfile(@Headers("authorization") auth: string, @Body() body: { nickname?: string; gender?: string; bio?: string; avatar?: string }) {
    const token = auth?.replace("Bearer ", "");
    const userId = token ? tokens.get(token) : null;
    if (!userId) return { error: "Not logged in" };
    try {
      const sets: string[] = [];
      const vals: any[] = [];
      if (body.nickname !== undefined) { sets.push("nickname = ?"); vals.push(body.nickname); }
      if (body.gender !== undefined) { sets.push("gender = ?"); vals.push(body.gender); }
      if (body.bio !== undefined) { sets.push("bio = ?"); vals.push(body.bio); }
      if (body.avatar !== undefined) { sets.push("avatar = ?"); vals.push(body.avatar); }
      if (sets.length === 0) return { error: "No fields" };
      vals.push(userId);
      await this.prisma.$executeRawUnsafe("UPDATE User SET " + sets.join(", ") + " WHERE id = ?", ...vals);
      const rows = await this.prisma.$queryRawUnsafe<any[]>("SELECT * FROM User WHERE id = ?", userId);
      return { success: true, user: toUser(rows?.[0]) };
    } catch (e: any) { return { error: e.message }; }
  }

  @Post("avatar")
  async uploadAvatar(@Req() req: any, @Res() res: any) {
    try {
      const multer = require("multer");
      const storage = multer.diskStorage({
        destination: function(_req: any, _file: any, cb: any) { cb(null, avatarDir); },
        filename: function(_req: any, file: any, cb: any) {
          const ext = path.extname(file.originalname) || ".png";
          cb(null, "avatar-" + Date.now() + "-" + Math.random().toString(36).slice(2, 5) + ext);
        }
      });
      const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }).single("file");
      upload(req, res, (err: any) => {
        if (err) return res.json({ error: err.message });
        const file = req.file;
        if (!file) return res.json({ error: "No file" });
        return res.json({ avatarUrl: "/avatars/" + file.filename });
      });
    } catch (e: any) { return res.json({ error: e.message }); }
  }
}
