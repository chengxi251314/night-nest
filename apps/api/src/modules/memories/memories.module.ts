import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { MemoriesController } from "./memories.controller";
import { MemoriesService } from "./memories.service";
import { MemoriesRepository } from "../../database/repositories/memories.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [MemoriesController],
  providers: [MemoriesService, MemoriesRepository]
})
export class MemoriesModule {}
