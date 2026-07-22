import type { CharacterProfile, RelationshipProfile, ScriptSimulationProject } from "@/lib/simulator/types";

type DialogueBucket = {
  name: string;
  lines: string[];
};

const traitRules: Array<{ keywords: string[]; trait: string }> = [
  { keywords: ["冷静", "沉着", "镇定"], trait: "冷静" },
  { keywords: ["敏锐", "观察", "洞察"], trait: "敏锐" },
  { keywords: ["嘴硬", "不承认", "逞强"], trait: "嘴硬心软" },
  { keywords: ["保护", "挡风险", "照顾"], trait: "保护欲强" },
  { keywords: ["寡言", "少说", "沉默"], trait: "克制寡言" },
  { keywords: ["优雅", "从容", "笑"], trait: "优雅危险" },
  { keywords: ["试探", "怀疑", "布局"], trait: "善于试探" },
  { keywords: ["责任", "必须", "不能失手"], trait: "责任感强" },
  { keywords: ["自由", "自己决定", "别替我做决定"], trait: "强烈自主" },
  { keywords: ["真相", "账本", "秘密"], trait: "追索真相" }
];

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || "character"
  );
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function pickTopTraits(text: string): string[] {
  const found = traitRules
    .filter((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
    .map((rule) => rule.trait);

  const fallback = text.includes("？") || text.includes("?") ? ["善于博弈"] : ["情绪内敛"];
  return unique([...found, ...fallback]).slice(0, 4);
}

function inferSpeakingStyle(lines: string[]): string {
  const merged = lines.join(" ");
  const shortLines = lines.filter((line) => line.length <= 16).length;
  const questionMarks = (merged.match(/[？?]/g) || []).length;
  const exclamations = (merged.match(/[！!]/g) || []).length;

  if (shortLines >= Math.max(2, Math.ceil(lines.length / 2))) {
    return "短句、克制、重点明确";
  }
  if (questionMarks >= 2) {
    return "擅长反问、喜欢把主动权握在手里";
  }
  if (exclamations >= 2) {
    return "情绪外放、推进感强";
  }
  return "语气稳定，带一点试探和观察";
}

function inferMotivation(name: string, lines: string[]): string {
  const text = lines.join(" ");
  if (text.includes("真相") || text.includes("账本")) return `${name}想尽快拿到真相并控制局面。`;
  if (text.includes("保护") || text.includes("挡风险") || text.includes("离她远点")) return `${name}的核心目标是保护在意的人不受伤。`;
  if (text.includes("决定") || text.includes("相信") || text.includes("怀疑")) return `${name}想把主动权牢牢握在自己手里。`;
  return `${name}希望在局势失控前先看清人心和筹码。`;
}

function inferTaboos(text: string): string[] {
  const items: string[] = [];
  if (text.includes("别替我做决定") || text.includes("不需要你")) items.push("厌恶别人越界替自己做决定");
  if (text.includes("怀疑")) items.push("反感被轻易定义立场");
  if (text.includes("笑") && text.includes("真话")) items.push("不接受虚伪和半真半假的试探");
  return items.length ? items : ["不愿意暴露真正软肋"];
}

function inferTriggers(text: string): string[] {
  const items: string[] = [];
  if (text.includes("迟到") || text.includes("结果")) items.push("对失约、低效率和失控很敏感");
  if (text.includes("保护") || text.includes("风险")) items.push("遇到危险时会迅速进入防御状态");
  if (text.includes("相信") || text.includes("怀疑")) items.push("信任话题会直接牵动情绪和判断");
  return items.length ? items : ["一旦被试探就会提高警惕"];
}

function inferSecrets(name: string, text: string): string[] {
  if (text.includes("保护") || text.includes("离她远点")) return [`${name}对目标人物的在意已经超过普通合作关系。`];
  if (text.includes("笑") || text.includes("验收答案")) return [`${name}大概率早已掌握部分真相，只是在观察谁会先失手。`];
  return [`${name}隐藏了真正的底牌，不会第一时间交代。`];
}

function inferRole(name: string, rawScript: string): string {
  const roleLine = rawScript
    .split(/\r?\n/)
    .find((line) => line.includes(`${name}：`) && /角色|设定/.test(line));

  if (roleLine) return roleLine.split(/[：:]/).slice(1).join(":").trim();

  const introLine = rawScript
    .split(/\r?\n/)
    .find((line) => line.includes(name) && /^[\-?]/.test(line.trim()));

  if (introLine) {
    const cleaned = introLine.replace(/^[\-?]\s*/, "");
    const fragments = cleaned.split(/[：:]/);
    return fragments.length > 1 ? fragments[1].split("，")[0].trim() : "关键角色";
  }

  return "关键角色";
}

function buildRelationships(name: string, names: string[], lines: string[]): RelationshipProfile[] {
  const merged = lines.join(" ");
  return names
    .filter((target) => target !== name)
    .filter((target) => merged.includes(target))
    .map((target) => ({
      target,
      summary:
        merged.includes("相信") || merged.includes("怀疑")
          ? `和${target}之间存在明显的不信任与拉扯。`
          : `和${target}之间有持续博弈，也有未说破的在意。`,
      intensity: Math.min(95, 45 + merged.split(target).length * 12)
    }));
}

export function extractSimulationProject(script: string): ScriptSimulationProject {
  const cleanScript = script.trim();
  const lines = cleanScript
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const title = lines.find((line) => /剧本标题|标题/.test(line))?.split(/[：:]/)[1]?.trim() || "未命名剧本";
  const world = lines.find((line) => /世界设定|背景/.test(line))?.split(/[：:]/)[1]?.trim() || "世界观待补充";
  const synopsis = lines.find((line) => /剧情摘要|梗概/.test(line))?.split(/[：:]/)[1]?.trim() || lines.slice(0, 4).join(" ");
  const sceneTitle = lines.find((line) => /^第.+场/.test(line) || /场景/.test(line)) || "当前场景";

  const dialogueMap = new Map<string, DialogueBucket>();
  const dialoguePattern = /^([A-Za-z\u4e00-\u9fa5·]{2,12})[：:](.+)$/;

  for (const line of lines) {
    const match = line.match(dialoguePattern);
    if (!match) continue;

    const [, name, content] = match;
    const current = dialogueMap.get(name) ?? { name, lines: [] };
    current.lines.push(content.trim());
    dialogueMap.set(name, current);
  }

  const names = [...dialogueMap.keys()];
  const characters: CharacterProfile[] = [...dialogueMap.values()].map((bucket) => {
    const merged = bucket.lines.join(" ");
    const speakingStyle = inferSpeakingStyle(bucket.lines);

    return {
      id: slugify(bucket.name),
      name: bucket.name,
      role: inferRole(bucket.name, cleanScript),
      corePersonality: pickTopTraits(`${cleanScript} ${merged}`),
      speakingStyle,
      motivation: inferMotivation(bucket.name, bucket.lines),
      taboos: inferTaboos(merged),
      emotionalTriggers: inferTriggers(merged),
      publicKnowledge: [`${bucket.name}在这场戏里拥有明确态度和立场。`, `${bucket.name}的说话方式是：${speakingStyle}。`],
      secrets: inferSecrets(bucket.name, merged),
      sampleLines: bucket.lines.slice(0, 3),
      relationships: buildRelationships(bucket.name, names, bucket.lines),
      evidence: bucket.lines.slice(0, 3)
    };
  });

  const themes = unique(
    [
      cleanScript.includes("真相") ? "真相" : "",
      cleanScript.includes("信任") ? "信任" : "",
      cleanScript.includes("保护") ? "保护与越界" : "",
      cleanScript.includes("账本") ? "利益博弈" : "",
      cleanScript.includes("决定") ? "控制权" : ""
    ].filter(Boolean)
  );

  return {
    title,
    synopsis,
    world,
    themes: themes.length ? themes : ["人物关系", "情绪拉扯"],
    characters,
    scene: {
      title: sceneTitle,
      summary: synopsis,
      currentBeat: characters[0] ? `${characters[0].name}正在试图掌握对话主动权。` : "角色尚未生成。",
      tension: cleanScript.includes("暴雨") || cleanScript.includes("危险") ? "高压、悬疑、随时可能翻盘" : "关系试探持续升温"
    }
  };
}

