export interface CharactersResponseDto {
  items: Array<{
    id: string;
    name: string;
    title: string;
    world: string;
  }>;
}
