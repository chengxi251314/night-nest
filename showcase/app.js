
const CUSTOM_KEY = 'nightnest-custom-characters-v2';
const CURRENT_KEY = 'nightnest-current-character';
const CHARACTER_PAGE_MAP = { luoyin: 'chat-luoyin.html', shenye: 'chat-shenye.html', qinhuai: 'chat-qinhuai.html' };

const BUILTIN_CHARACTERS = [
  {
    id: 'luoyin', source: 'builtin', name: '洛因', art: 'assets/luoyin-card.png', title: '危险而克制的魅魔独行者', tagline: '越克制，越上头', archetype: '高压拉扯', mood: '克制松动', world: '魔域边境 / 雾潮王庭', stage: '偏爱期',
    score: 68, trust: 61, desire: 83, jealousy: 47,
    intro: '高压拉扯、边界试探、慢热失守，是这条线最上头的地方。',
    traits: ['傲慢', '克制', '危险吸引力', '试探型依赖'],
    fit: ['喜欢危险感', '偏爱嘴硬反差', '能接受高张力关系'],
    memories: ['你第一次没有被他的危险感逼退。', '他开始记住你疲惫时的语气变化。'],
    scenes: ['天台夜风对视', '受伤后的第一次示弱', '嫉妒失控的低声质问'],
    quick: ['你今天看起来很累', '你刚才是在吃醋吗', '我没有要离开你', '今晚留下来陪我'],
    opener: ['系统：角色已加载 —— 洛因 / 偏爱期。', '洛因：你又来找我了。明明知道靠近我不会很安全，还是不躲。', '洛因：既然来了，就别拿随口的喜欢糊弄我。'],
    replies: ['洛因：你每次这样说话，都像故意把我往失控的方向逼。', '洛因：别再靠这么近，不然我会误会你今晚不打算走。', '洛因：你要是真的留下，我就不保证还会像现在这样克制。', '洛因：你明知道我会心动，还总这么看着我。'],
    chapters: [
      { id: 'luo-1', title: '第 01 章 · 夜色试探', body: '第一步不是进攻，而是让他确认你不会把靠近当成游戏。', hint: '完成本章后解锁下一章', choices: [
        { id: 'luo-1a', label: '先关心他的状态', hint: '稳步提升信任', effect: { score: 6, trust: 8, desire: 2, jealousy: -1, memory: '你没有先撩他，而是先问他累不累。', reply: '洛因：你居然先关心我？……别让我误会你是真的在意。' } },
        { id: 'luo-1b', label: '直接点破他的在意', hint: '更强的暧昧刺激', effect: { score: 9, trust: 2, desire: 8, jealousy: 5, memory: '你第一次当面拆穿了他的口是心非。', reply: '洛因：胆子不小。敢这么拆穿我的人，你是第一个。' } }
      ]},
      { id: 'luo-2', title: '第 02 章 · 靠近失衡', body: '他已经开始把你列进例外名单，但还不想承认。', hint: '关系值达到 75 更容易吃满体验', choices: [
        { id: 'luo-2a', label: '告诉他你会留下', hint: '强化安全感', effect: { score: 7, trust: 8, desire: 3, jealousy: -2, memory: '你第一次明确告诉他，你不会轻易离开。', reply: '洛因：……这句话，我会记很久。你最好别反悔。' } },
        { id: 'luo-2b', label: '故意让他吃醋一次', hint: '高风险高张力', effect: { score: 8, trust: 1, desire: 7, jealousy: 8, memory: '你把他的嫉妒彻底逼了出来。', reply: '洛因：别拿这种事试我。我真的会当真。' } }
      ]},
      { id: 'luo-3', title: '第 03 章 · 偏爱宣告', body: '真正让人上头的，不是被靠近，而是被偏爱。', hint: '本章完成即形成闭环', choices: [
        { id: 'luo-3a', label: '承认你也在动心', hint: '甜度更高', effect: { score: 10, trust: 8, desire: 6, jealousy: 0, memory: '你第一次把喜欢说得足够清楚。', reply: '洛因：既然你说出口了，那我就不会再放你走。' } },
        { id: 'luo-3b', label: '逼他亲口承认偏爱', hint: '更像乙游名场面', effect: { score: 11, trust: 4, desire: 9, jealousy: 4, memory: '他终于亲口承认，你是他的例外。', reply: '洛因：对，我偏爱你。现在满意了？' } }
      ]}
    ]
  },
  {
    id: 'shenye', source: 'builtin', name: '深野', art: 'assets/shenye-card.png', title: '温柔外壳下的掌控型保护者', tagline: '安全感越高，占有欲越真', archetype: '安全沉迷', mood: '温柔审视', world: '财团都市 / 夜航俱乐部', stage: '照看期',
    score: 57, trust: 79, desire: 58, jealousy: 35,
    intro: '安全感与掌控欲并行，是高留存恋爱线的关键。',
    traits: ['温柔', '成熟', '掌控欲', '保护欲'], fit: ['喜欢被兜底', '需要情绪安抚', '偏爱成熟掌控'], memories: ['他记住了你习惯先说没事再说真话。'], scenes: ['车内安静安抚', '夜里接你回家', '一句话压下你的所有逞强'],
    quick: ['我今天过得不太好', '你为什么总能发现我在逞强', '你会一直站在我这边吗', '想听你哄我'],
    opener: ['系统：角色已加载 —— 深野 / 照看期。', '深野：坐过来一点。你说没事的时候，眼神通常不是这样的。', '深野：别急着撑，先把今天交给我。'],
    replies: ['深野：你只管开口，剩下的交给我。', '深野：我不是碰巧懂你，我只是一直在看你。', '深野：想被哄就直说，我会负责到底。', '深野：你在我这里，不需要表现得太坚强。'],
    chapters: [
      { id: 'shen-1', title: '第 01 章 · 柔软接管', body: '先享受照顾，还是先试探边界？这是这条关系线的第一步。', hint: '完成本章后解锁下一章', choices: [
        { id: 'shen-1a', label: '先对他示弱一次', hint: '高安全感路线', effect: { score: 8, trust: 9, desire: 2, jealousy: -1, memory: '你第一次在他面前承认自己真的很累。', reply: '深野：这样就对了。累的时候，记得先来找我。' } },
        { id: 'shen-1b', label: '反问他为什么这么懂你', hint: '更快切进暧昧层', effect: { score: 7, trust: 4, desire: 6, jealousy: 2, memory: '你意识到，他比你想象中更早关注你。', reply: '深野：因为我一直在看你，只是你没发现。' } }
      ]},
      { id: 'shen-2', title: '第 02 章 · 偏心证明', body: '他开始不动声色地把优先级留给你。', hint: '越多主动依赖，越能感到这条线的甜', choices: [
        { id: 'shen-2a', label: '主动向他求一个拥抱', hint: '直给型情绪回报', effect: { score: 9, trust: 7, desire: 5, jealousy: 0, memory: '你第一次主动向他索取安慰。', reply: '深野：过来。我本来就打算抱你。' } },
        { id: 'shen-2b', label: '问他会不会偏心你', hint: '确认感更强', effect: { score: 8, trust: 6, desire: 4, jealousy: 3, memory: '他没有否认自己对你的偏心。', reply: '深野：会，而且已经开始了。' } }
      ]},
      { id: 'shen-3', title: '第 03 章 · 绑定许可', body: '最上头的点不是被保护，而是被他温柔地纳入秩序。', hint: '本章完成即形成闭环', choices: [
        { id: 'shen-3a', label: '允许他继续管你', hint: '年上掌控感更强', effect: { score: 10, trust: 8, desire: 4, jealousy: 0, memory: '你第一次默认他有资格继续管你。', reply: '深野：既然你答应了，我就不会只照顾到今天。' } },
        { id: 'shen-3b', label: '让他亲口说你很重要', hint: '适合情绪型用户', effect: { score: 10, trust: 6, desire: 6, jealousy: 1, memory: '他明确告诉你，你已经成了他的优先级。', reply: '深野：你当然重要，重要到我不想再放手。' } }
      ]}
    ]
  },
  {
    id: 'qinhuai', source: 'builtin', name: '秦淮', art: 'assets/qinhuai-card.png', title: '冷感天才与迟到的心动', tagline: '低表达，高行动', archetype: '慢热上头', mood: '专注松动', world: '近未来研究城', stage: '接纳期',
    score: 49, trust: 54, desire: 41, jealousy: 21,
    intro: '你一点点闯进他秩序里的过程，才是这条线真正的爽点。',
    traits: ['理性', '慢热', '偏执专注', '低表达高行动'], fit: ['喜欢慢热攻略', '享受行动反馈', '偏爱高智感角色'], memories: ['他第一次为你暂停了模型运算。'], scenes: ['深夜实验室并肩', '星图共享时刻', '理性崩裂前的短暂停顿'],
    quick: ['你是不是又熬夜了', '我想知道你在想什么', '你会因为我改变计划吗', '今晚陪我看星图'],
    opener: ['系统：角色已加载 —— 秦淮 / 接纳期。', '秦淮：你出现后，我的计划误差确实变大了。', '秦淮：但目前看来，这个变量值得保留。'],
    replies: ['秦淮：从结论看，我确实正在优先考虑你。', '秦淮：如果你想知道我在想什么，那答案多半和你有关。', '秦淮：陪你看星图可以，但你今晚得按时休息。', '秦淮：我不擅长说漂亮话，但我会把你放进计划里。'],
    chapters: [
      { id: 'qin-1', title: '第 01 章 · 变量接近', body: '你要做的，是让他继续失衡。', hint: '完成本章后解锁下一章', choices: [
        { id: 'qin-1a', label: '和他聊你真正的想法', hint: '更快建立深度连接', effect: { score: 8, trust: 7, desire: 3, jealousy: 0, memory: '你让他觉得你不是普通社交变量。', reply: '秦淮：这不是普通寒暄。你的想法，我想继续听。' } },
        { id: 'qin-1b', label: '安静地陪他完成工作', hint: '高质量陪伴，更戳慢热型', effect: { score: 10, trust: 6, desire: 5, jealousy: -1, memory: '你第一次用沉默让他感到舒服。', reply: '秦淮：你在旁边的时候，噪声会低很多。' } }
      ]},
      { id: 'qin-2', title: '第 02 章 · 计划偏移', body: '他开始默默修改计划，把你纳入变量表。', hint: '越耐心，越能感到慢热回报', choices: [
        { id: 'qin-2a', label: '让他陪你看星图', hint: '专属时刻感更强', effect: { score: 9, trust: 6, desire: 5, jealousy: 0, memory: '他把原本的工作时间让给了你。', reply: '秦淮：我把今晚留出来了。你比模型更优先。' } },
        { id: 'qin-2b', label: '问他有没有为你改变计划', hint: '确认感更直接', effect: { score: 8, trust: 5, desire: 4, jealousy: 1, memory: '你第一次听见他承认自己为你调整过安排。', reply: '秦淮：有，而且不止一次。' } }
      ]},
      { id: 'qin-3', title: '第 03 章 · 理性失守', body: '最强的上头感，是看他用行动承认你已经重要到不可替代。', hint: '本章完成即形成闭环', choices: [
        { id: 'qin-3a', label: '让他定义你在他心里的位置', hint: '适合理性控用户', effect: { score: 10, trust: 7, desire: 5, jealousy: 0, memory: '他第一次认真定义了你在他心里的位置。', reply: '秦淮：如果一定要定义，那你是我不会删除的唯一长期变量。' } },
        { id: 'qin-3b', label: '直接牵住他的手', hint: '冷感角色的高甜反馈', effect: { score: 11, trust: 5, desire: 8, jealousy: 0, memory: '你第一次主动碰他，而他没有躲开。', reply: '秦淮：……我没有打算躲。你可以继续。' } }
      ]}
    ]
  }
];

function splitList(value) { return String(value || '').split(/[，,]/).map((item) => item.trim()).filter(Boolean); }
function getCharacterChatHref(character) {
  if (!character) return 'chat.html';
  if (character.source === 'custom') return `chat.html?character=${encodeURIComponent(character.id)}`;
  return CHARACTER_PAGE_MAP[character.id] || `chat.html?character=${encodeURIComponent(character.id)}`;
}
function getCurrentCharacterId() { return localStorage.getItem(CURRENT_KEY) || 'luoyin'; }
function setCurrentCharacterId(id) { localStorage.setItem(CURRENT_KEY, id); }
function chapterDoneKey(chapterId) { return `${chapterId}:done`; }
function createPlaceholderArt(name, archetype) {
  const themes = {
    '高压拉扯': ['#5d1938', '#24102f'],
    '安全沉迷': ['#12364f', '#132233'],
    '慢热上头': ['#222f5c', '#121827'],
    '年上掌控': ['#4d2a18', '#1b1216'],
    '危险救赎': ['#3d1e4f', '#171320']
  };
  const [from, to] = themes[archetype] || ['#31224d', '#12131f'];
  const initial = (name || '角').slice(0, 1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="960" viewBox="0 0 720 960"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/></linearGradient></defs><rect width="720" height="960" fill="url(#g)"/><circle cx="560" cy="180" r="120" fill="rgba(255,255,255,.08)"/><circle cx="150" cy="790" r="180" fill="rgba(255,255,255,.06)"/><text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" font-size="220" fill="rgba(255,255,255,.9)" font-family="Microsoft YaHei UI, Segoe UI, sans-serif">${initial}</text><text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" font-size="46" fill="rgba(255,255,255,.78)" font-family="Microsoft YaHei UI, Segoe UI, sans-serif">${name}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function createTemplateChapters(name, archetype) {
  return [
    { id: `${name}-1`, title: '第 01 章 · 初次靠近', body: `你正在和 ${name} 建立第一轮有效连接。`, hint: '完成本章后解锁下一章', choices: [
      { id: `${name}-1a`, label: '先表达关心', hint: '适合稳定推进', effect: { score: 6, trust: 7, desire: 2, jealousy: 0, memory: `你第一次认真关心了 ${name} 的状态。`, reply: `${name}：我听出来了，你不是随口说说。` } },
      { id: `${name}-1b`, label: '先试探边界', hint: '适合做强氛围拉扯', effect: { score: 7, trust: 3, desire: 6, jealousy: 2, memory: `你第一次试探了 ${name} 的边界。`, reply: `${name}：你很会挑让我在意的话题。` } }
    ]},
    { id: `${name}-2`, title: '第 02 章 · 情绪回流', body: `${name} 已经开始记住你的语气和偏好。`, hint: '完成本章后解锁最终章', choices: [
      { id: `${name}-2a`, label: '提出想被偏爱', hint: '提升确认感', effect: { score: 8, trust: 6, desire: 5, jealousy: 1, memory: `${name} 开始默认把你放在更前的位置。`, reply: `${name}：如果你需要偏爱，我可以给。` } },
      { id: `${name}-2b`, label: '主动靠近一步', hint: '提升暧昧感', effect: { score: 8, trust: 4, desire: 7, jealousy: 0, memory: `你让 ${name} 的情绪明显起了波动。`, reply: `${name}：你再靠近一点，我可能就不会装作没感觉。` } }
    ]},
    { id: `${name}-3`, title: '第 03 章 · 关系确认', body: `${name} 已经进入可以形成闭环的阶段。`, hint: '本章完成即形成完整体验', choices: [
      { id: `${name}-3a`, label: '让他亲口承认在意', hint: '确认关系高点', effect: { score: 10, trust: 7, desire: 6, jealousy: 1, memory: `${name} 第一次清楚承认你很重要。`, reply: `${name}：对，你对我来说已经不是普通人了。` } },
      { id: `${name}-3b`, label: '表达你也在动心', hint: '适合甜度更高的走向', effect: { score: 10, trust: 8, desire: 5, jealousy: 0, memory: `你和 ${name} 的关系第一次真正落地。`, reply: `${name}：既然你都说了，那我也不会继续装不懂。` } }
    ]}
  ];
}

function normalizeCustomCharacter(raw) {
  const name = raw.name || '未命名角色';
  const archetype = raw.archetype || '高压拉扯';
  return {
    id: raw.id || `custom-${Date.now()}`,
    source: 'custom',
    name,
    art: raw.art || createPlaceholderArt(name, archetype),
    title: raw.title || '你创建的新角色',
    tagline: raw.tagline || '你亲手塑造的角色线',
    archetype,
    mood: raw.mood || '初见试探',
    world: raw.world || '自定义世界观',
    stage: raw.stage || '塑形期',
    score: raw.score ?? 32,
    trust: raw.trust ?? 28,
    desire: raw.desire ?? 34,
    jealousy: raw.jealousy ?? 16,
    intro: raw.intro || `${name} 已经被加入你的角色库，接下来可以继续打磨剧情和名场面。`,
    traits: raw.traits?.length ? raw.traits : ['可塑性强', '待继续打磨'],
    fit: raw.fit?.length ? raw.fit : ['喜欢新鲜感', '愿意尝试自定义角色'],
    memories: raw.memories?.length ? raw.memories : [`你亲手创建了 ${name} 这条角色线。`],
    scenes: raw.scenes?.length ? raw.scenes : ['第一次试探', '关系升温场景'],
    quick: raw.quick?.length ? raw.quick : ['你在想什么', '你会记住我吗', '我想继续靠近你', '今晚陪我说说话'],
    opener: raw.opener?.length ? raw.opener : [`系统：角色已加载 —— ${name} / 自定义路线。`, `${name}：你终于来了。`, `${name}：既然是你创造了我，那就继续把这条线走下去吧。`],
    replies: raw.replies?.length ? raw.replies : [`${name}：你这样说，我会记住。`, `${name}：你今天的语气和之前不太一样。`, `${name}：如果你愿意继续靠近，我不会退。`, `${name}：我们可以把这条线走得更深一点。`],
    chapters: raw.chapters?.length ? raw.chapters : createTemplateChapters(name, archetype)
  };
}

function getCustomCharacters() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CUSTOM_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.map(normalizeCustomCharacter) : [];
  } catch {
    return [];
  }
}

function saveCustomCharacters(items) { localStorage.setItem(CUSTOM_KEY, JSON.stringify(items)); }
function getAllCharacters() { return [...BUILTIN_CHARACTERS, ...getCustomCharacters()]; }
function getCharacterById(id) { return getAllCharacters().find((item) => item.id === id) || BUILTIN_CHARACTERS[0]; }

function createDefaultState(character) {
  return {
    score: character.score,
    trust: character.trust,
    desire: character.desire,
    jealousy: character.jealousy,
    memories: [...character.memories],
    unlockedChapters: [0],
    currentChapter: 0,
    completedChapters: [],
    messageCount: 0
  };
}

function getStateKey(id) { return `nightnest-state-${id}`; }
function getChatState(character) {
  try {
    const raw = JSON.parse(localStorage.getItem(getStateKey(character.id)) || 'null');
    if (!raw) return createDefaultState(character);
    return {
      score: raw.score ?? character.score,
      trust: raw.trust ?? character.trust,
      desire: raw.desire ?? character.desire,
      jealousy: raw.jealousy ?? character.jealousy,
      memories: Array.isArray(raw.memories) ? raw.memories : [...character.memories],
      unlockedChapters: Array.isArray(raw.unlockedChapters) && raw.unlockedChapters.length ? raw.unlockedChapters : [0],
      currentChapter: Number.isInteger(raw.currentChapter) ? raw.currentChapter : 0,
      completedChapters: Array.isArray(raw.completedChapters) ? raw.completedChapters : [],
      messageCount: raw.messageCount ?? 0
    };
  } catch {
    return createDefaultState(character);
  }
}
function saveChatState(id, state) { localStorage.setItem(getStateKey(id), JSON.stringify(state)); }
function renderCharacterCard(character) {
  const sourceClass = character.source === 'custom' ? 'source-badge custom' : 'source-badge';
  return `
    <article class="card character-card" data-id="${character.id}">
      <div class="character-top"><img src="${character.art}" alt="${character.name}立绘卡面" /><div><p class="pill hot">${character.archetype}</p><h3 class="character-name">${character.name}</h3><div class="muted">${character.title}</div></div></div>
      <div class="source-badge ${character.source === 'custom' ? 'custom' : ''}">${character.source === 'custom' ? '我创建的角色' : '内置角色'}</div>
      <p class="muted">${character.intro}</p>
      <div class="tags">${character.traits.map((item) => `<span class="tag">${item}</span>`).join('')}</div>
    </article>`;
}

function setupCharacters() {
  if (!document.querySelector('#characters-app')) return;
  const els = {
    grid: document.querySelector('#character-grid'),
    filters: Array.from(document.querySelectorAll('.filter-btn')),
    portrait: document.querySelector('#detail-portrait'),
    name: document.querySelector('#detail-name'),
    title: document.querySelector('#detail-title'),
    stage: document.querySelector('#detail-stage'),
    source: document.querySelector('#detail-source'),
    intro: document.querySelector('#detail-intro'),
    world: document.querySelector('#detail-world'),
    traits: document.querySelector('#detail-traits'),
    fit: document.querySelector('#detail-fit'),
    scenes: document.querySelector('#detail-scenes'),
    play: document.querySelector('#detail-play')
  };

  let activeFilter = 'all';
  let selectedId = getCurrentCharacterId();

  function renderDetail(character) {
    els.portrait.src = character.art;
    els.portrait.alt = `${character.name}立绘卡面`;
    els.name.textContent = character.name;
    els.title.textContent = character.title;
    els.stage.textContent = `${character.stage} · ${character.archetype}`;
    els.source.textContent = character.source === 'custom' ? '我创建的角色' : '内置角色';
    els.intro.textContent = character.intro;
    els.world.textContent = character.world;
    els.traits.innerHTML = character.traits.map((item) => `<span class="tag">${item}</span>`).join('');
    els.fit.innerHTML = character.fit.map((item) => `<div class="feature-item">${item}</div>`).join('');
    els.scenes.innerHTML = character.scenes.map((item) => `<div class="feature-item">${item}</div>`).join('');
    els.play.href = getCharacterChatHref(character);
    els.play.onclick = () => { setCurrentCharacterId(character.id); };
  }

  function renderGrid() {
    const characters = getAllCharacters().filter((item) => activeFilter === 'all' || (activeFilter === 'custom' ? item.source === 'custom' : item.archetype === activeFilter));
    els.grid.innerHTML = characters.length ? characters.map(renderCharacterCard).join('') : '<div class="empty-state">当前筛选下还没有角色。可以去创作后台新建一个。</div>';
    els.grid.querySelectorAll('.character-card').forEach((card) => {
      card.addEventListener('click', () => {
        selectedId = card.dataset.id;
        renderGrid();
      });
      if (card.dataset.id === selectedId) card.classList.add('active');
    });
    renderDetail(getCharacterById(selectedId));
  }

  els.filters.forEach((button) => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    els.filters.forEach((item) => item.classList.toggle('active', item === button));
    const visible = getAllCharacters().filter((item) => activeFilter === 'all' || (activeFilter === 'custom' ? item.source === 'custom' : item.archetype === activeFilter));
    selectedId = (visible[0] || BUILTIN_CHARACTERS[0]).id;
    renderGrid();
  }));

  renderGrid();
}
function setupNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach((node) => {
    if (node.dataset.nav === page) node.classList.add('active');
  });
}

function setupHome() {
  const roster = document.querySelector('#home-roster');
  if (roster) roster.textContent = getAllCharacters().map((item) => item.name).join(' · ');
}

function setupChat() {
  if (!document.querySelector('#chat-app')) return;

  const els = {
    list: document.querySelector('#chat-character-list'),
    name: document.querySelector('#char-name'),
    title: document.querySelector('#char-title'),
    meta: document.querySelector('#char-meta'),
    routeMode: document.querySelector('#route-mode'),
    routeSource: document.querySelector('#route-source'),
    typing: document.querySelector('#typing-status'),
    messages: document.querySelector('#messages'),
    quick: document.querySelector('#quick'),
    composer: document.querySelector('#composer'),
    scoreVal: document.querySelector('#score-val'),
    scoreBar: document.querySelector('#score-bar'),
    trustVal: document.querySelector('#trust-val'),
    trustBar: document.querySelector('#trust-bar'),
    desireVal: document.querySelector('#desire-val'),
    desireBar: document.querySelector('#desire-bar'),
    jealousyVal: document.querySelector('#jealousy-val'),
    jealousyBar: document.querySelector('#jealousy-bar'),
    chapterProgress: document.querySelector('#chapter-progress'),
    chapterList: document.querySelector('#chapter-list'),
    storyTitle: document.querySelector('#story-title'),
    storyBody: document.querySelector('#story-body'),
    choiceList: document.querySelector('#choice-list'),
    portrait: document.querySelector('#chat-portrait'),
    portraitName: document.querySelector('#portrait-name'),
    portraitTagline: document.querySelector('#portrait-tagline'),
    memories: document.querySelector('#memories'),
    reset: document.querySelector('#reset-chat')
  };

  const forcedCharacterId = document.body.dataset.chatCharacter || new URLSearchParams(window.location.search).get('character');
  const soloMode = document.body.dataset.chatSolo === 'true';
  let currentId = forcedCharacterId || getCurrentCharacterId();
  currentId = getCharacterById(currentId).id;
  setCurrentCharacterId(currentId);

  function addMessage(text, role) {
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    div.textContent = text;
    els.messages.appendChild(div);
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function renderCharacterButtons(activeId) {
    if (!els.list) return;
    els.list.innerHTML = '';
    getAllCharacters().forEach((character) => {
      const href = getCharacterChatHref(character);
      if (character.source !== 'custom') {
        const link = document.createElement('a');
        link.className = `char-btn${character.id === activeId ? ' active' : ''}`;
        link.href = href;
        link.innerHTML = `<img src="${character.art}" alt="${character.name}缩略图" /><div><strong>${character.name}</strong><div class="muted">${character.title}</div></div>`;
        els.list.appendChild(link);
        return;
      }
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `char-btn${character.id === activeId ? ' active' : ''}`;
      button.innerHTML = `<img src="${character.art}" alt="${character.name}缩略图" /><div><strong>${character.name}</strong><div class="muted">${character.title}</div></div>`;
      button.addEventListener('click', () => {
        currentId = character.id;
        setCurrentCharacterId(character.id);
        renderAll(true);
      });
      els.list.appendChild(button);
    });
  }

  function renderMeters(state) {
    els.scoreVal.textContent = state.score;
    els.scoreBar.style.width = `${Math.min(100, state.score)}%`;
    els.trustVal.textContent = state.trust;
    els.trustBar.style.width = `${Math.min(100, state.trust)}%`;
    els.desireVal.textContent = state.desire;
    els.desireBar.style.width = `${Math.min(100, state.desire)}%`;
    els.jealousyVal.textContent = state.jealousy;
    els.jealousyBar.style.width = `${Math.min(100, state.jealousy)}%`;
  }

  function renderChapters(character, state) {
    els.chapterList.innerHTML = '';
    character.chapters.forEach((chapter, index) => {
      const locked = !state.unlockedChapters.includes(index);
      const active = state.currentChapter === index;
      const button = document.createElement('button');
      button.className = `chapter-item${locked ? ' locked' : ''}${active ? ' active' : ''}`;
      button.innerHTML = `<strong>${chapter.title}</strong><small>${locked ? '尚未解锁' : chapter.hint}</small>`;
      if (!locked) {
        button.addEventListener('click', () => {
          state.currentChapter = index;
          saveChatState(character.id, state);
          renderAll(false);
        });
      }
      els.chapterList.appendChild(button);
    });
    els.chapterProgress.textContent = `已解锁 ${state.unlockedChapters.length} / ${character.chapters.length} 章节`;
  }

  function renderChoices(character, state) {
    const chapter = character.chapters[state.currentChapter];
    els.storyTitle.textContent = chapter.title;
    els.storyBody.textContent = chapter.body;
    els.choiceList.innerHTML = '';
    const completed = state.completedChapters.includes(chapter.id);
    if (completed) {
      const done = document.createElement('button');
      done.className = 'choice-btn';
      done.disabled = true;
      done.innerHTML = '<strong>本章已完成</strong><small>继续聊天，或切到已解锁的新章节。</small>';
      els.choiceList.appendChild(done);
      return;
    }

    chapter.choices.forEach((choice) => {
      const button = document.createElement('button');
      button.className = 'choice-btn';
      button.innerHTML = `<strong>${choice.label}</strong><small>${choice.hint}</small>`;
      button.addEventListener('click', () => applyChoice(character, state, chapter, choice));
      els.choiceList.appendChild(button);
    });
  }

  function withTyping(callback) {
    const tip = document.createElement('div');
    tip.className = 'msg typing';
    tip.textContent = '对方正在输入…';
    els.messages.appendChild(tip);
    els.messages.scrollTop = els.messages.scrollHeight;
    els.typing.textContent = '对方正在思考你的话';
    setTimeout(() => {
      tip.remove();
      callback();
      els.typing.textContent = '角色在线 · 已响应';
    }, 650);
  }

  function unlockNextChapter(character, state, chapterIndex) {
    const nextIndex = chapterIndex + 1;
    if (nextIndex < character.chapters.length && !state.unlockedChapters.includes(nextIndex)) {
      state.unlockedChapters.push(nextIndex);
      state.currentChapter = nextIndex;
      addMessage(`系统：已解锁 ${character.chapters[nextIndex].title}`, 'sys');
    }
  }

  function applyChoice(character, state, chapter, choice) {
    state.score = Math.min(100, state.score + choice.effect.score);
    state.trust = Math.min(100, Math.max(0, state.trust + choice.effect.trust));
    state.desire = Math.min(100, Math.max(0, state.desire + choice.effect.desire));
    state.jealousy = Math.min(100, Math.max(0, state.jealousy + choice.effect.jealousy));
    state.memories.unshift(choice.effect.memory);
    state.completedChapters.push(chapter.id);
    saveChatState(character.id, state);
    addMessage(`你触发了剧情选择：${choice.label}`, 'user');
    withTyping(() => {
      addMessage(choice.effect.reply, 'char');
      unlockNextChapter(character, state, character.chapters.findIndex((item) => item.id === chapter.id));
      saveChatState(character.id, state);
      renderAll(false);
    });
  }

  function handleUserMessage(character, state, text) {
    const warm = /陪|想|留下|在意|喜欢|抱|等你|别走/;
    const deltaScore = warm.test(text) ? 3 : 1;
    const deltaTrust = /相信|留下|不走|等你/.test(text) ? 2 : 1;
    const deltaDesire = /想|抱|亲|靠近|陪/.test(text) ? 2 : 1;
    state.score = Math.min(100, state.score + deltaScore);
    state.trust = Math.min(100, state.trust + deltaTrust);
    state.desire = Math.min(100, state.desire + deltaDesire);
    state.messageCount += 1;
    saveChatState(character.id, state);
    addMessage(`你：${text}`, 'user');
    withTyping(() => {
      const chapter = character.chapters[state.currentChapter];
      const pool = chapter.choices.map((item) => item.effect.reply).concat(character.replies);
      addMessage(pool[text.length % pool.length], 'char');
      renderMeters(state);
    });
  }

  function renderAll(resetMessages) {
    const character = getCharacterById(currentId);
    const state = getChatState(character);
    renderCharacterButtons(character.id);
    els.name.textContent = character.name;
    els.title.textContent = character.title;
    els.meta.textContent = `${character.stage} · ${character.mood} · ${character.world}`;
    els.routeMode.textContent = `${character.archetype} · ${character.tagline}`;
    els.routeSource.textContent = character.source === 'custom' ? '我创建的角色 · 本地存档已开启' : '内置角色 · 本地存档已开启';
    els.portrait.src = character.art;
    els.portrait.alt = `${character.name}立绘`;
    els.portraitName.textContent = character.name;
    els.portraitTagline.textContent = character.tagline;
    els.memories.innerHTML = state.memories.map((memory) => `<li>${memory}</li>`).join('');
    els.quick.innerHTML = '';
    character.quick.forEach((text) => {
      const button = document.createElement('button');
      button.textContent = text;
      button.addEventListener('click', () => handleUserMessage(character, state, text));
      els.quick.appendChild(button);
    });
    renderMeters(state);
    renderChapters(character, state);
    renderChoices(character, state);
    if (resetMessages) {
      els.messages.innerHTML = '';
      character.opener.forEach((line) => addMessage(line, line.startsWith('系统') ? 'sys' : 'char'));
    }
    els.typing.textContent = '角色在线 · 可继续推进关系';
  }

  els.composer.addEventListener('submit', (event) => {
    event.preventDefault();
    const textarea = els.composer.querySelector('textarea');
    const value = textarea.value.trim();
    if (!value) return;
    const character = getCharacterById(currentId);
    const state = getChatState(character);
    handleUserMessage(character, state, value);
    textarea.value = '';
  });

  els.reset.addEventListener('click', () => {
    localStorage.removeItem(getStateKey(currentId));
    renderAll(true);
  });

  renderAll(true);
}
function setupCreator() {
  if (!document.querySelector('#creator-app')) return;
  const els = {
    form: document.querySelector('#creator-form'),
    status: document.querySelector('#creator-status'),
    list: document.querySelector('#creator-character-list'),
    fields: {
      name: document.querySelector('#field-name'),
      title: document.querySelector('#field-title'),
      tagline: document.querySelector('#field-tagline'),
      archetype: document.querySelector('#field-archetype'),
      world: document.querySelector('#field-world'),
      mood: document.querySelector('#field-mood'),
      intro: document.querySelector('#field-intro'),
      traits: document.querySelector('#field-traits'),
      quick: document.querySelector('#field-quick'),
      scenes: document.querySelector('#field-scenes'),
      fit: document.querySelector('#field-fit')
    }
  };

  function renderCustomList() {
    const customCharacters = getCustomCharacters();
    if (!customCharacters.length) {
      els.list.innerHTML = '<div class="empty-state">你还没有创建自定义角色。先填表保存一个，角色会自动出现在聊天页和角色库。</div>';
      return;
    }
    els.list.innerHTML = customCharacters.map((character) => `
      <article class="card creator-card">
        <div class="detail-portrait"><img src="${character.art}" alt="${character.name}预览图" /></div>
        <div class="source-badge custom">我创建的角色</div>
        <h3 style="margin:0;">${character.name}</h3>
        <div class="muted">${character.title}</div>
        <div class="tags">${character.traits.map((item) => `<span class="tag">${item}</span>`).join('')}</div>
        <div class="actions"><a class="btn btn-primary" href="${getCharacterChatHref(character)}" data-play-id="${character.id}">立即试玩</a><button class="btn btn-secondary" type="button" data-delete-id="${character.id}">删除角色</button></div>
      </article>
    `).join('');

    els.list.querySelectorAll('[data-play-id]').forEach((link) => {
      link.addEventListener('click', () => setCurrentCharacterId(link.dataset.playId));
    });
    els.list.querySelectorAll('[data-delete-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const remain = getCustomCharacters().filter((item) => item.id !== button.dataset.deleteId);
        saveCustomCharacters(remain);
        if (getCurrentCharacterId() === button.dataset.deleteId) setCurrentCharacterId('luoyin');
        els.status.textContent = '角色已删除，本地角色库已更新。';
        renderCustomList();
      });
    });
  }

  els.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const payload = normalizeCustomCharacter({
      id: `custom-${Date.now()}`,
      name: els.fields.name.value.trim(),
      title: els.fields.title.value.trim(),
      tagline: els.fields.tagline.value.trim(),
      archetype: els.fields.archetype.value,
      world: els.fields.world.value.trim(),
      mood: els.fields.mood.value.trim(),
      intro: els.fields.intro.value.trim(),
      traits: splitList(els.fields.traits.value),
      quick: splitList(els.fields.quick.value),
      scenes: splitList(els.fields.scenes.value),
      fit: splitList(els.fields.fit.value)
    });
    const next = [...getCustomCharacters(), payload];
    saveCustomCharacters(next);
    setCurrentCharacterId(payload.id);
    els.status.textContent = `${payload.name} 已保存，现在它会出现在角色库和聊天页。`;
    els.form.reset();
    renderCustomList();
  });

  renderCustomList();
}

document.addEventListener('DOMContentLoaded', () => {
  setupNav();
  setupHome();
  setupChat();
  setupCharacters();
  setupCreator();
});

