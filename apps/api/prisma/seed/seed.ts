import { seedCharacters, seedRelationships } from "./seed-data";

export function previewSeed() {
  return {
    seededAt: "2026-07-21",
    characters: seedCharacters,
    relationships: seedRelationships
  };
}
