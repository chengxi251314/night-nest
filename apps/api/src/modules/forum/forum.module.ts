import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { ForumController } from "./forum.controller";

@Module({
  imports: [DatabaseModule],
  controllers: [ForumController],
})
export class ForumModule {}
