import { Injectable } from "@nestjs/common";
import type { CharacterSummaryDto } from "../../../../../packages/config/contracts/api";
import { CharactersRepository } from "../../database/repositories/characters.repository";

@Injectable()
export class CharactersService {
  constructor(private readonly charactersRepository: CharactersRepository) {}

  async findAll(): Promise<{ items: CharacterSummaryDto[] }> {
    const items = await this.charactersRepository.findAll();
    return { items };
  }
}
