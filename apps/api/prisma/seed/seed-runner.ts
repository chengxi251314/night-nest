import { previewSeed } from "./seed";

async function run() {
  console.log(JSON.stringify(previewSeed(), null, 2));
}

run();
