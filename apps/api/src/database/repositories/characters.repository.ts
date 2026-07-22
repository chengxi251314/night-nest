import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { seedCharacters } from "../../../prisma/seed/seed-data";

@Injectable()
export class CharactersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    try {
      return await this.prisma.character.findMany({
        select: { id: true, name: true, title: true, world: true }
      });
    } catch {
      return seedCharacters;
    }
  }
}
