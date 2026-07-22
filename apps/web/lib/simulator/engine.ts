import type { CharacterProfile, ChatMessage, ScriptSimulationProject } from "@/lib/simulator/types";

function inferUserIntent(message: string): string {
  if (/(喜欢|在意|爱|想你)/.test(message)) return "情感确认";
  if (/(为什么|怎么|真相|秘密)/.test(message)) return "追问真相";
  if (/(帮我|救我|保护|陪我)/.test(message)) return "寻求依靠";
  if (/(不信|怀疑|骗我)/.test(message)) return "质疑试探";
  return "日常推进";
}

function inferMood(character: CharacterProfile, userMessage: string): string {
  if (/(别|走开|烦|闭嘴)/.test(userMessage)) return "被冒犯后的冷硬";
  if (/(帮我|陪我|需要你)/.test(userMessage)) return "被需要后的松动";
  if (/(为什么|真相|秘密)/.test(userMessage)) return "警惕中的坦白边缘";
  if (character.corePersonality.includes("优雅危险")) return "从容试探";
  if (character.corePersonality.includes("保护欲强")) return "克制保护";
  return "稳定观察";
}

function styleLead(character: CharacterProfile, mood: string): string {
  if (character.speakingStyle.includes("短句")) return mood.includes("冷硬") ? "先别激我。" : "我在听。";
  if (character.speakingStyle.includes("反问")) return mood.includes("坦白") ? "你确定现在就要答案？" : "你是在试探我，还是想听真话？";
  if (character.speakingStyle.includes("情绪外放")) return "你这样说，我很难当作没听见。";
  return "我知道你这句话不只是表面意思。";
}

function relationshipNudge(project: ScriptSimulationProject, character: CharacterProfile): string {
  const closest = [...character.relationships].sort((left, right) => right.intensity - left.intensity)[0];
  if (!closest) return `现在的重点不是场面，而是${character.name}心里那条底线。`;
  return `${character.name}和${closest.target}之间的张力还在，任何一句话都可能把局面推向另一边。`;
}

export function buildOpeningMessages(project: ScriptSimulationProject, character: CharacterProfile): ChatMessage[] {
  return [
    {
      role: "system",
      text: `已载入《${project.title}》模拟。当前场景：${project.scene.title}。氛围：${project.scene.tension}。`
    },
    {
      role: "character",
      text: `${styleLead(character, "稳定观察")}我是${character.name}。${character.motivation}`
    }
  ];
}

export function generateCharacterReply(project: ScriptSimulationProject, character: CharacterProfile, userMessage: string, history: ChatMessage[]): ChatMessage {
  const mood = inferMood(character, userMessage);
  const intent = inferUserIntent(userMessage);
  const lastUserTurns = history.filter((item) => item.role === "user").slice(-2).map((item) => item.text).join(" ");
  const lead = styleLead(character, mood);
  const trait = character.corePersonality[0] ?? "情绪内敛";
  const secret = character.secrets[0] ?? `${character.name}没有把真正想法说满。`;
  const taboo = character.taboos[0] ?? "不要逼我马上表态。";

  let body = "";

  switch (intent) {
    case "情感确认":
      body = `${lead}如果你要的是态度，我不会装作无所谓。只是我更在意你说完这句话之后，会不会真的留下来。`;
      break;
    case "追问真相":
      body = `${lead}真相我不是不能给你，只是现在每多说一句，都可能让局面提前失控。${secret}`;
      break;
    case "寻求依靠":
      body = `${lead}你可以靠过来，但别把这当成软弱。对我来说，接住你本来就是一种选择。`;
      break;
    case "质疑试探":
      body = `${lead}你有资格怀疑我，但别用最轻率的方式下结论。${taboo}。`;
      break;
    default:
      body = `${lead}你现在的语气我记住了。以${character.name}这种${trait}的人来说，这种时候不会轻易给空话，只会先看你真正想推进到哪一步。`;
      break;
  }

  const follow =
    lastUserTurns && intent !== "日常推进"
      ? `刚才你提到“${lastUserTurns.slice(-16)}”，这已经足够让我重新判断我们之间的距离。`
      : relationshipNudge(project, character);

  return {
    role: "character",
    text: `${body} ${follow}`
  };
}

