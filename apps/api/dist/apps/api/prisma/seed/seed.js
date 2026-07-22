"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewSeed = previewSeed;
const seed_data_1 = require("./seed-data");
function previewSeed() {
    return {
        seededAt: "2026-07-21",
        characters: seed_data_1.seedCharacters,
        relationships: seed_data_1.seedRelationships
    };
}
