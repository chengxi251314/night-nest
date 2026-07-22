import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { RelationshipsController } from "./relationships.controller";
import { RelationshipsService } from "./relationships.service";
import { RelationshipsRepository } from "../../database/repositories/relationships.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [RelationshipsController],
  providers: [RelationshipsService, RelationshipsRepository]
})
export class RelationshipsModule {}
