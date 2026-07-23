import { Controller, Get, Post, Headers } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";

const tokens = new Map<string, string>();

@Controller("v1/notifications")
export class NotificationController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Headers("authorization") auth: string) {
    const token = auth?.replace("Bearer ", "");
    const userId = token ? tokens.get(token) : null;
    const uid = userId || "demo-user";
    try {
      const rows = await this.prisma.$queryRawUnsafe<any[]>(
        "SELECT * FROM Notification WHERE userId = ? OR userId = 'all' ORDER BY createdAt DESC LIMIT 30", uid
      );
      const unread = rows.filter(r => !r.read).length;
      return { items: rows, unread };
    } catch { return { items: [], unread: 0 }; }
  }

  @Post("read-all")
  async readAll(@Headers("authorization") auth: string) {
    const token = auth?.replace("Bearer ", "");
    const userId = token ? tokens.get(token) : null;
    const uid = userId || "demo-user";
    try {
      await this.prisma.$executeRawUnsafe("UPDATE Notification SET read = 1 WHERE userId = ?", uid);
      return { success: true };
    } catch { return { error: "Failed" }; }
  }
}
