import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/database.module";
import { CharactersController } from "./characters.controller";
import { CharactersService } from "./characters.service";
import { CharactersRepository } from "../../database/repositories/characters.repository";

@Module({
  imports: [DatabaseModule],
  controllers: [CharactersController],
  providers: [CharactersService, CharactersRepository]
})
export class CharactersModule {}
