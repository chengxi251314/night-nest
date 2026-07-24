import { Controller, Get, Post, Param, Body, Headers } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";
import { getUserIdFromAuth } from "../auth/auth-helper";

@Controller("v1/conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(":characterId/seed")
  getSeed(@Param("characterId") characterId: string, @Headers("authorization") auth: string) {
    const userId = getUserIdFromAuth(auth);
    return this.conversationsService.getSeed(characterId, userId);
  }

  @Post(":characterId/messages")
  postMessage(@Param("characterId") characterId: string, @Body() body: any, @Headers("authorization") auth: string) {
    const userId = getUserIdFromAuth(auth);
    return this.conversationsService.postMessage(characterId, body.content, userId, {
      apiKey: body.apiKey, baseUrl: body.baseUrl, model: body.model
    });
  }

  @Post(":characterId/persist")
  persistMessage(@Param("characterId") characterId: string, @Body() body: any, @Headers("authorization") auth: string) {
    const userId = getUserIdFromAuth(auth);
    return this.conversationsService.persistMessage(characterId, body.role, body.content, userId);
  }
}
