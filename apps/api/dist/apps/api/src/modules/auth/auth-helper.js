"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToken = setToken;
exports.getTokenUserId = getTokenUserId;
exports.getUserIdFromAuth = getUserIdFromAuth;
exports.generateAuthToken = generateAuthToken;
const tokens = new Map();
function setToken(token, userId) {
    tokens.set(token, userId);
}
function getTokenUserId(token) {
    return tokens.get(token) || null;
}
function getUserIdFromAuth(auth) {
    if (!auth)
        return "demo-user";
    const token = auth.replace("Bearer ", "");
    const userId = tokens.get(token);
    return userId || "demo-user";
}
function generateAuthToken(userId) {
    const token = "nn_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
    tokens.set(token, userId);
    return token;
}
