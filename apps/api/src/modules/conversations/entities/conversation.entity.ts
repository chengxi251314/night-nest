export class ConversationEntity {
  id!: string;
  userId!: string;
  characterId!: string;
  status!: "active" | "archived";
}
