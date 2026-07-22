export type RelationshipProfile = {
  target: string;
  summary: string;
  intensity: number;
};

export type CharacterProfile = {
  id: string;
  name: string;
  role: string;
  corePersonality: string[];
  speakingStyle: string;
  motivation: string;
  taboos: string[];
  emotionalTriggers: string[];
  publicKnowledge: string[];
  secrets: string[];
  sampleLines: string[];
  relationships: RelationshipProfile[];
  evidence: string[];
};

export type StoryScene = {
  title: string;
  summary: string;
  currentBeat: string;
  tension: string;
};

export type ScriptSimulationProject = {
  title: string;
  synopsis: string;
  world: string;
  themes: string[];
  characters: CharacterProfile[];
  scene: StoryScene;
};

export type ChatMessage = {
  role: "system" | "character" | "user";
  text: string;
};

