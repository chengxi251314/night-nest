export interface HealthDto {
  name: string;
  status: "ok";
  date: string;
}

export interface CharacterSummaryDto {
  id: string;
  name: string;
  title: string;
  world: string;
}

export interface RelationshipStateDto {
  characterId: string;
  score: number;
  stage: string;
  mood: string;
}

export interface MemoryListDto {
  characterId: string;
  items: string[];
}

export interface StoryNodeDto {
  characterId: string;
  title: string;
  body: string;
}

export interface MessageDto {
  role: "system" | "character" | "user";
  text: string;
}

export interface ConversationSeedDto {
  characterId: string;
  messages: MessageDto[];
}

export interface ConversationReplyDto {
  characterId: string;
  reply: MessageDto;
}
