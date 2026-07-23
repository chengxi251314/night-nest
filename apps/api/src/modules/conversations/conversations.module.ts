import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { ConversationsController } from "./conversations.controller";
import { ConversationsService } from "./conversations.service";
import { ConversationsRepository } from "../../database/repositories/conversations.repository";
import { RelationshipsRepository } from "../../database/repositories/relationships.repository";
import { MemoriesRepository } from "../../database/repositories/memories.repository";
import { PrismaService } from "../../database/prisma.service";

@Module({
  imports: [DatabaseModule],
  controllers: [ConversationsController],
  providers: [ConversationsService, ConversationsRepository, RelationshipsRepository, MemoriesRepository, PrismaService]
})
export class ConversationsModule {}
