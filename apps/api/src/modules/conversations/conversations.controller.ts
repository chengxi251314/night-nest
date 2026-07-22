import { Controller, Get, Post, Param, Body } from "@nestjs/common";
import { ConversationsService } from "./conversations.service";

@Controller("v1/conversations")
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get(":characterId/seed")
  getSeed(@Param("characterId") characterId: string) {
    return this.conversationsService.getSeed(characterId);
  }

  @Post(":characterId/messages")
  postMessage(
    @Param("characterId") characterId: string,
    @Body() body: any
  ) {
    return this.conversationsService.postMessage(characterId, body.content, {
      apiKey: body.apiKey,
      baseUrl: body.baseUrl,
      model: body.model
    });
  }
}
