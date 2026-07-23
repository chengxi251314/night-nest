import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { NotificationController } from "./notification.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [NotificationController],
})
export class NotificationModule {}
