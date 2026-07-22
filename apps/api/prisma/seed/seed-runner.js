"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = require("./seed");
async function run() {
    console.log(JSON.stringify((0, seed_1.previewSeed)(), null, 2));
}
run();
