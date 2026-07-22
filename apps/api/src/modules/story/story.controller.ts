import { Controller, Get, Param } from "@nestjs/common";
import { StoryService } from "./story.service";

@Controller("v1/story")
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get(":characterId")
  findCurrentNode(@Param("characterId") characterId: string) {
    return this.storyService.findCurrentNode(characterId);
  }
}
