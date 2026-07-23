"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const health_module_1 = require("./modules/health/health.module");
const characters_module_1 = require("./modules/characters/characters.module");
const conversations_module_1 = require("./modules/conversations/conversations.module");
const relationships_module_1 = require("./modules/relationships/relationships.module");
const memories_module_1 = require("./modules/memories/memories.module");
const story_module_1 = require("./modules/story/story.module");
const admin_module_1 = require("./modules/admin/admin.module");
const auth_module_1 = require("./modules/auth/auth.module");
const script_module_1 = require("./modules/scripts/script.module");
const forum_module_1 = require("./modules/forum/forum.module");
const search_module_1 = require("./modules/search/search.module");
const notification_module_1 = require("./modules/notifications/notification.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [health_module_1.HealthModule, characters_module_1.CharactersModule, conversations_module_1.ConversationsModule, relationships_module_1.RelationshipsModule, memories_module_1.MemoriesModule, story_module_1.StoryModule, admin_module_1.AdminModule, auth_module_1.AuthModule, script_module_1.ScriptModule, forum_module_1.ForumModule, search_module_1.SearchModule, notification_module_1.NotificationModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService]
    })
], AppModule);
