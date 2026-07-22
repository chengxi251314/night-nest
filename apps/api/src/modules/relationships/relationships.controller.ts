import { Controller, Get, Param } from "@nestjs/common";
import { RelationshipsService } from "./relationships.service";

@Controller("v1/relationships")
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Get(":characterId")
  findOne(@Param("characterId") characterId: string) {
    return this.relationshipsService.findOne(characterId);
  }
}
