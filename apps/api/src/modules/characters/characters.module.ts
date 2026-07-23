import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { PrismaService } from "../../database/prisma.service";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";
import { CharactersRepository } from "../../database/repositories/characters.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [CharactersController],
  providers: [CharactersService, CharactersRepository, PrismaService]
})
export class CharactersModule {}
