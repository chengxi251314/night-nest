"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationsController = void 0;
const common_1 = require("@nestjs/common");
const conversations_service_1 = require("./conversations.service");
let ConversationsController = class ConversationsController {
    conversationsService;
    constructor(conversationsService) {
        this.conversationsService = conversationsService;
    }
    getSeed(characterId) {
        return this.conversationsService.getSeed(characterId);
    }
    postMessage(characterId, body) {
        return this.conversationsService.postMessage(characterId, body.content, {
            apiKey: body.apiKey,
            baseUrl: body.baseUrl,
            model: body.model
        });
    }
    persistMessage(characterId, body) {
        return this.conversationsService.persistMessage(characterId, body.role, body.content);
    }
};
exports.ConversationsController = ConversationsController;
__decorate([
    (0, common_1.Get)(":characterId/seed"),
    __param(0, (0, common_1.Param)("characterId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "getSeed", null);
__decorate([
    (0, common_1.Post)(":characterId/messages"),
    __param(0, (0, common_1.Param)("characterId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "postMessage", null);
__decorate([
    (0, common_1.Post)(":characterId/persist"),
    __param(0, (0, common_1.Param)("characterId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ConversationsController.prototype, "persistMessage", null);
exports.ConversationsController = ConversationsController = __decorate([
    (0, common_1.Controller)("v1/conversations"),
    __metadata("design:paramtypes", [conversations_service_1.ConversationsService])
], ConversationsController);
