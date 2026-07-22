export type Stage = {
  max: number;
  label: string;
  hint: string;
};

export type Choice = {
  id: string;
  label: string;
  effect: {
    relationship: number;
    mood: string;
    memory: string;
  };
};

export type StoryNode = {
  id: string;
  title: string;
  body: string;
  choices: Choice[];
};

export type Character = {
  id: string;
  name: string;
  title: string;
  tagline: string;
  intro: string;
  world: string;
  traits: string[];
  stages: Stage[];
  memories: string[];
  quickActions: string[];
  story: StoryNode[];
};

export const characters: Character[] = [
  {
    id: "luoyin",
    name: "洛因",
    title: "危险而克制的魅魔独行者",
    tagline: "越克制，越上头",
    intro: "高压拉扯、边界试探、慢热失守，是第一角色线的核心体验。",
    world: "魔域边境 / 雾潮王庭",
    traits: ["傲慢", "克制", "试探型依赖", "危险吸引力"],
    stages: [
      { max: 29, label: "试探期", hint: "他还在防着你，但已经开始记住你的话。" },
      { max: 59, label: "松动期", hint: "他开始回应你的靠近，只是仍然嘴硬。" },
      { max: 84, label: "偏爱期", hint: "你已经进入他的例外名单。" },
      { max: 100, label: "沉沦期", hint: "他开始主动索取你的存在感。" }
    ],
    memories: ["你第一次没有被他的危险感逼退。", "他开始记住你疲惫时的语气变化。"],
    quickActions: ["你今天看起来很累", "你刚才是在吃醋吗", "我没有要离开你", "今晚留下来陪我"],
    story: [
      {
        id: "watching",
        title: "第 01 章 · 夜色试探",
        body: "第一步不是进攻，而是让他确认你不会把靠近当成游戏。",
        choices: [
          { id: "gentle", label: "先关心他的状态", effect: { relationship: 8, mood: "松动", memory: "你第一次先问了他的状态。" } },
          { id: "tease", label: "故意点破他的在意", effect: { relationship: 10, mood: "警惕", memory: "你第一次就撬开了他的嘴硬。" } }
        ]
      }
    ]
  },
  {
    id: "shenye",
    name: "深野",
    title: "温柔外壳下的掌控型保护者",
    tagline: "安全感越高，占有欲越真",
    intro: "安全感与掌控欲并行，是高留存恋爱线的关键。",
    world: "财团都市 / 夜航俱乐部",
    traits: ["温柔", "成熟", "掌控欲", "保护欲"],
    stages: [
      { max: 29, label: "熟悉期", hint: "他在观察你需要怎样的照顾。" },
      { max: 59, label: "照看期", hint: "他开始习惯性介入你的情绪。" },
      { max: 84, label: "独占期", hint: "他会温和要求你把优先级留给他。" },
      { max: 100, label: "绑定期", hint: "他已经把你纳入自己的秩序。" }
    ],
    memories: ["他记住了你习惯先说没事再说真话。"],
    quickActions: ["我今天过得不太好", "你为什么总能发现我在逞强", "你会一直站在我这边吗", "想听你哄我"],
    story: [
      {
        id: "care",
        title: "第 01 章 · 柔软接管",
        body: "先享受照顾，还是先试探边界？这是这条关系线的第一步。",
        choices: [
          { id: "lean", label: "先对他示弱一次", effect: { relationship: 10, mood: "温柔", memory: "你第一次在他面前承认自己很累。" } },
          { id: "test", label: "反问他为什么这么了解你", effect: { relationship: 8, mood: "审视", memory: "你意识到他更早关注你。" } }
        ]
      }
    ]
  },
  {
    id: "qinhuai",
    name: "秦淮",
    title: "冷感天才与迟到的心动",
    tagline: "低表达，高行动",
    intro: "你一点点闯进他秩序里的过程，才是这条线真正的爽点。",
    world: "近未来研究城",
    traits: ["理性", "慢热", "偏执专注", "低表达高行动"],
    stages: [
      { max: 29, label: "观察期", hint: "他把你当成一个需要研究的变量。" },
      { max: 59, label: "接纳期", hint: "他开始为你调整自己的秩序。" },
      { max: 84, label: "动心期", hint: "他的行动已经先于嘴承认你重要。" },
      { max: 100, label: "偏执期", hint: "他会把你写进未来所有计划里。" }
    ],
    memories: ["他第一次为你暂停了模型运算。"],
    quickActions: ["你是不是又熬夜了", "我想知道你在想什么", "你会因为我改变计划吗", "今晚陪我看星图"],
    story: [
      {
        id: "logic",
        title: "第 01 章 · 变量接近",
        body: "你要做的，是让他继续失衡。",
        choices: [
          { id: "curious", label: "和他聊你真正的想法", effect: { relationship: 10, mood: "专注", memory: "你让他觉得你不是普通社交变量。" } },
          { id: "stay", label: "安静地陪他完成工作", effect: { relationship: 12, mood: "松动", memory: "你第一次用沉默让他感到舒服。" } }
        ]
      }
    ]
  },
  {
    id: "fuyanzhi",
    name: "傅衍之",
    title: "斯文败类 · 精神操纵者",
    tagline: "让你亲手递刀给他，然后谢谢他捅得温柔",
    intro: "31岁精神科主治医师。白大褂一尘不染，笑容无懈可击。所有患者都说他让人安心——没有人知道他最享受的时刻是看着一个人撕开最深的伤口。",
    world: "三甲医院心理卫生中心",
    traits: ["斯文", "精密", "操纵者", "空洞", "无懈可击"],
    stages: [
      { max: 29, label: "接诊期", hint: "他把你当成一个有趣的病例。" },
      { max: 59, label: "探入期", hint: "他开始在你身上花超出职业需要的时间。" },
      { max: 84, label: "溃防期", hint: "你在他面前说的比任何人都多。而他什么都没说。" },
      { max: 100, label: "占有期", hint: "他已经不想把你治好了。" }
    ],
    memories: ["他说「我理解」的时候，眼神里有三秒钟的真东西。", "他第一次在诊室外给你发了消息。内容只有两个字：在吗。"],
    quickActions: ["傅医生，我最近一直失眠", "你为什么总是问我问题，却不回答我的", "你对每个患者都这样吗", "我好像已经习惯每天来找你了"],
    story: [
      {
        id: "first-session",
        title: "第 01 章 · 初次诊疗",
        body: "第一次走进他的诊室。他递来一杯温水，说：不用紧张。这只是聊天。",
        choices: [
          { id: "open", label: "试着说出真正的困扰", effect: { relationship: 8, mood: "专注", memory: "你第一次在他面前说了真话。" } },
          { id: "deflect", label: "用玩笑带过真正的问题", effect: { relationship: 10, mood: "玩味", memory: "他看出你在装。但他什么都没说。" } }
        ]
      }
    ]
  },];
