import { Injectable } from "@nestjs/common";
import type { StoryNodeDto } from "../../../../../packages/config/contracts/api";
import { StoryRepository } from "../../database/repositories/story.repository";

@Injectable()
export class StoryService {
  constructor(private readonly storyRepository: StoryRepository) {}

  async findCurrentNode(characterId: string): Promise<StoryNodeDto> {
    const node = await this.storyRepository.findCurrentNode(characterId);
    return node ?? { characterId, title: "未知章节", body: "暂无剧情" };
  }
}
