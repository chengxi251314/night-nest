import { Controller, Get, Param } from "@nestjs/common";
import { MemoriesService } from "./memories.service";

@Controller("v1/memories")
export class MemoriesController {
  constructor(private readonly memoriesService: MemoriesService) {}

  @Get(":characterId")
  findByCharacter(@Param("characterId") characterId: string) {
    return this.memoriesService.findByCharacter(characterId);
  }
}
