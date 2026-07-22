import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { StoryRepository } from "../../database/repositories/story.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [StoryController],
  providers: [StoryService, StoryRepository]
})
export class StoryModule {}
