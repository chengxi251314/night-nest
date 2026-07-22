import { Controller, Get } from "@nestjs/common";
import { CharactersService } from "./characters.service";

@Controller("v1/characters")
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Get()
  findAll() {
    return this.charactersService.findAll();
  }
}
