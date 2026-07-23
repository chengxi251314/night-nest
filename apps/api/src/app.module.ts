import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { HealthModule } from "./modules/health/health.module";
import { CharactersModule } from "./modules/characters/characters.module";
import { ConversationsModule } from "./modules/conversations/conversations.module";
import { RelationshipsModule } from "./modules/relationships/relationships.module";
import { MemoriesModule } from "./modules/memories/memories.module";
import { StoryModule } from "./modules/story/story.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ScriptModule } from "./modules/scripts/script.module";
import { ForumModule } from "./modules/forum/forum.module";
import { SearchModule } from "./modules/search/search.module";
import { NotificationModule } from "./modules/notifications/notification.module";

@Module({
  imports: [HealthModule, CharactersModule, ConversationsModule, RelationshipsModule, MemoriesModule, StoryModule, AdminModule, AuthModule, ScriptModule, ForumModule, SearchModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
