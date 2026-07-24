import { Injectable } from "@nestjs/common";
import type { RelationshipStateDto } from "../../../../../packages/config/contracts/api";
import { RelationshipsRepository } from "../../database/repositories/relationships.repository";

@Injectable()
export class RelationshipsService {
  constructor(private readonly relationshipsRepository: RelationshipsRepository) {}

  async findOne(characterId: string, userId: string): Promise<RelationshipStateDto> {
    const state = await this.relationshipsRepository.findByUserAndCharacter(userId, characterId);
    return state ?? { characterId, score: 0, stage: "未知", mood: "未知" };
  }
}
