import { Controller, Get, Param, Headers } from "@nestjs/common";
import { RelationshipsService } from "./relationships.service";
import { getUserIdFromAuth } from "../auth/auth-helper";

@Controller("v1/relationships")
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Get(":characterId")
  findOne(@Param("characterId") characterId: string, @Headers("authorization") auth: string) {
    const userId = getUserIdFromAuth(auth);
    return this.relationshipsService.findOne(characterId, userId);
  }
}
