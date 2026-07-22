import { Injectable } from "@nestjs/common";
import type { MemoryListDto } from "../../../../../packages/config/contracts/api";
import { MemoriesRepository } from "../../database/repositories/memories.repository";

@Injectable()
export class MemoriesService {
  constructor(private readonly memoriesRepository: MemoriesRepository) {}

  async findByCharacter(characterId: string): Promise<MemoryListDto> {
    const items = await this.memoriesRepository.findByUserAndCharacter("demo-user", characterId);
    return { characterId, items: items.map((item) => item.summary) };
  }
}
