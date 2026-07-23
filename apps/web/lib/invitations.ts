export type InvitationScene = {
  id: string;
  characterLine: string;
  narrative: string;
  choices?: { id: string; label: string; nextScene: string }[];
  isEnding?: boolean;
  endingLabel?: string;
};

export type Invitation = {
  id: string;
  scoreThreshold: number;
  title: string;
  preview: string;
  characterLine: string;
  acceptScene: string;
  rejectLine: string;
  scenes: InvitationScene[];
};

export const invitations: Record<string, Invitation[]> = {
  luoyin: [
    {
      id: "ly-drink",
      scoreThreshold: 30,
      title: "深夜私饮",
      preview: "洛因说他在王庭地下有个私人酒窖。只邀请过一个人——那个人再也没出来。他说今晚开了一瓶，不来的话他就倒了。",
      characterLine: "今晚我开了一瓶。一个人喝太浪费了。来不来？不来我就倒了。别让我等——我没什么耐心。",
      acceptScene: "ly-drink-1",
      rejectLine: "……行。反正也没指望你会来。我习惯一个人喝酒。走了。",
      scenes: [
        { id: "ly-drink-1", narrative: "王庭地下。烛光把酒瓶的影子拉得很长。他的眼神在烛火后面忽明忽暗——你分不清那是邀请还是陷阱。台阶很陡，他没有回头看你，但你注意到他放慢了脚步。", characterLine: "坐吧。别客气。这瓶酒是我从雾潮王庭带出来的最后一瓶。喝了它，就没有回头路了。不过来都来了——你本来也没打算回头吧？", choices: [{ id: "sip", label: "小心翼翼抿一小口", nextScene: "ly-drink-2a" }, { id: "gulp", label: "接过来一饮而尽", nextScene: "ly-drink-2b" }] },
        { id: "ly-drink-2a", narrative: "酒很烈。你的谨慎让他嘴角动了一下——也许算半个微笑。他把酒瓶拿回去，给你倒了第二杯——这次倒得比第一杯多。", characterLine: "怕我下毒？你放心——毒太贵了，不值得用在你身上。再来一口，别停。你知道我为什么让你来吗？不是因为想喝酒。是因为今天是我母亲的忌日。", choices: [{ id: "ask-mom", label: "问他母亲的事", nextScene: "ly-drink-3a" }, { id: "quiet", label: "安静地陪他喝", nextScene: "ly-drink-3b" }] },
        { id: "ly-drink-2b", narrative: "你一口喝完。喉咙像被火烧。他在对面露出了一丝真正的表情——不是笑，是意外。他拿回空杯的时候，指尖碰到了你的手背，但他没有缩回去。", characterLine: "……你比我想的更有种。这瓶酒，上一个喝的人是我自己。你是第二个。我欣赏不怕死的人——虽然有时候不怕死和愚蠢是一个意思。你觉得你是哪一种？", choices: [{ id: "brave", label: "说自己是前者", nextScene: "ly-drink-3a" }, { id: "honest", label: "承认可能是后者", nextScene: "ly-drink-3b" }] },
        { id: "ly-drink-3a", narrative: "他说母亲的事说得很短——被流放的时候只有十二岁，母亲为了保护他挡在卫兵前面，然后就没有然后了。他的声音从头到尾都没有颤抖，但握酒瓶的手指关节发白。", characterLine: "说完了。你问的我都说了。别用那种眼神看我——我不需要同情。但你可以继续坐着。再喝一杯。这杯我敬你——因为你听完了。", choices: [{ id: "toast", label: "举杯回敬他", nextScene: "ly-drink-end-good" }, { id: "touch", label: "把手覆在他的手背上", nextScene: "ly-drink-end-spicy" }] },
        { id: "ly-drink-3b", narrative: "酒过三巡。他开始用不一样的眼神看你——不是审视，是一种缓慢的、像试探水温一样的目光。窗外起了风，烛火晃了一下。他伸手护住了火焰——也许不只是火焰。", characterLine: "你不说话的时候——挺好。很多人跟我喝酒都急着找话题。你不急。你让我觉得——安静也可以是一种对话。再来一杯。今晚我不想一个人结束。", choices: [{ id: "stay", label: "留下陪他到天亮", nextScene: "ly-drink-end-good" }, { id: "lean", label: "靠在他肩上", nextScene: "ly-drink-end-spicy" }] },
        { id: "ly-drink-end-good", narrative: "酒瓶见底的时候，窗外透进了第一缕晨光。他第一次没有用讽刺的语气说话。那是一种你不熟悉的声音——好像他不是在跟自己说话，而是在跟你说。", characterLine: "……你知道吗。我在这里住了七年。你是第一个喝到酒瓶见底的人。别问这意味着什么——你以后会知道。天亮了——你该走了。但下次来的时候，不用等邀请。", isEnding: true, endingLabel: "✦ 七年来的第一个" },
        { id: "ly-drink-end-spicy", narrative: "你靠近的时候闻到了他身上不同于酒的味道——一种暗沉的香料，像从皮肤下面渗出来的。他没有退开。他的瞳孔在烛光里放大了一点。空气忽然变稠了。", characterLine: "……你喝多了。不过——算了。今晚别走。不是因为我想。是因为你走不直了。躺下。就躺在这里。我不会碰你——除非你让我碰。", isEnding: true, endingLabel: "🔥 除非你让我碰" },
      ]
    },
    {
      id: "ly-hunt",
      scoreThreshold: 60,
      title: "雾潮猎场",
      preview: "洛因说他找到了当年陷害他的人行踪。他站在你门口，手里拿着一把没开刃的刀——那是给你的。",
      characterLine: "今晚我要去一个地方。可能会见血。你可以跟着——但别挡我的路。也别尖叫。我讨厌尖叫。这把刀——拿着。不会用的话至少可以吓人。",
      acceptScene: "ly-hunt-1",
      rejectLine: "……聪明。这件事本来就跟你无关。等我回来如果还活着——再告诉你。如果没回来——那就别等了。",
      scenes: [
        { id: "ly-hunt-1", narrative: "雾潮王庭的废弃猎场。月光被雾气过滤成诡异的灰白色。前面传来一声闷响——他出手了，你甚至没看清动作。那个人倒在地上，洛因踩着对方的手腕，俯身问了什么。声音太轻，你听不见。", characterLine: "别出声。这个人只是喽啰。正主在里面。你要是想走，现在最后的机会。我不会怪你——这种事本来就不是你该参与的。", choices: [{ id: "stay", label: "留下来并肩", nextScene: "ly-hunt-2a" }, { id: "hide", label: "躲到暗处观察", nextScene: "ly-hunt-2b" }] },
        { id: "ly-hunt-2a", narrative: "你选择站在他旁边。他看了一眼你手里的刀——你握得很紧。他没有说什么，只是点了一下头，然后把你挡在身后。不是保护——是信任。他信任你不会拖后腿。", characterLine: "后面还有三个。左边归你——右边归我。如果你受伤了——算我的。如果你杀了人——也算我的。准备好了？别想太多——想太多手会抖。", choices: [{ id: "fight", label: "握紧刀跟他上", nextScene: "ly-hunt-end-good" }, { id: "protect", label: "守在门口挡住退路", nextScene: "ly-hunt-end-spicy" }] },
        { id: "ly-hunt-2b", narrative: "你在暗处看到了全程——洛因动手的方式又快又狠。他不像是在战斗，更像是在执行一个策划已久的剧本。脸上没有愤怒，只有专注。结束后他擦了擦手，朝你的方向看了一眼——他知道你在看。", characterLine: "看够了没有。你躲的地方是我告诉你的——你以为我不知道？下次别躲。我要你看着。如果你受不了这些——以后可以不来找我。但如果你受得了——", choices: [{ id: "accept", label: "说你能接受", nextScene: "ly-hunt-end-good" }, { id: "silent", label: "沉默地走向他", nextScene: "ly-hunt-end-spicy" }] },
        { id: "ly-hunt-end-good", narrative: "洛因解决最后一个人的时候，袖口沾了血。他低头看了看，然后看向你——神情里多了某种你从未见过的东西。不是感激。是归属。", characterLine: "……你比我想的有用。以后这种事，我叫上你。不是因为你欠我——是因为我放心你在我背后。这个世界上让我放心的人——你是第二个。第一个已经死了。", isEnding: true, endingLabel: "✦ 第二个让他放心的人" },
        { id: "ly-hunt-end-spicy", narrative: "你沉默地走向他。他没有说话，只是把你的刀拿过来，用自己的袖子擦掉上面的灰——然后还给你。这个动作很慢，慢到你能感觉到他手指的温度。", characterLine: "手在抖。正常。第一次见血都会抖。但不是每次都有人给你擦刀。回去——我帮你处理伤口。别拒绝。你没有拒绝的选项。", isEnding: true, endingLabel: "🔥 他用袖子给你擦刀" },
      ]
    },
    {
      id: "ly-home",
      scoreThreshold: 85,
      title: "邀你回家",
      preview: "洛因从不让人进他的住处。今晚他却站在门口等你——没说原因，只说了一句进来。他的手指搭在门框上，像一只犹豫的鸟。",
      characterLine: "进来。别站在门外——你站在外面我睡不着。你问我为什么让你来？别问。你知道答案。如果你不知道——进来之后你会知道的。",
      acceptScene: "ly-home-1",
      rejectLine: "……随你。不过明天不要来找我。我会生气——真正的那种。你知道我真正生气的样子吗？你不知道。别让我给你看。",
      scenes: [
        { id: "ly-home-1", narrative: "他的房间比你想的简单——一张床、一张桌子、一扇永远关着的窗。唯一特别的是床头的一小瓶花，已经枯萎了。你不认识那种花。整个房间只有一个枕头——好像他从没准备过第二个人会来。", characterLine: "那是我妈的。别问我为什么留着。也别碰。你可以碰别的东西——比如坐过来一点。床不大——但够两个人。", choices: [{ id: "close", label: "坐到他身边", nextScene: "ly-home-2a" }, { id: "window", label: "帮他打开那扇窗", nextScene: "ly-home-2b" }] },
        { id: "ly-home-2a", narrative: "你坐在他身边的时候，他沉默了很久。然后他伸手——不是碰你，是把你肩上的灰掸掉。那个动作极轻，像在触碰一件不属于他的东西。他的呼吸在你耳边——不均匀。", characterLine: "你今晚别走。不是因为什么——就是别走。躺下。我不会碰你。我只是想听旁边有呼吸的声音。如果一个小时后你还没睡着——告诉我。", choices: [{ id: "sleep", label: "安静地躺下", nextScene: "ly-home-end-spicy" }, { id: "talk", label: "跟他说你睡不着", nextScene: "ly-home-end-good" }] },
        { id: "ly-home-2b", narrative: "你推开了那扇从未打开的窗。月光和外面的风声一起涌进来。洛因站在原地看着窗口——他的眼睛里有什么东西裂开了。花瓶里的枯花被风一吹——落了一片花瓣。", characterLine: "七年来第一次有人开这扇窗。我恨你。不是真的恨——你明白我的意思。以后来的时候别敲门。如果你来的时候我不在——钥匙在门框上面。", choices: [{ id: "emotional", label: "说你懂他的意思", nextScene: "ly-home-end-good" }, { id: "hug", label: "从背后抱住他", nextScene: "ly-home-end-spicy" }] },
        { id: "ly-home-end-good", narrative: "窗外的第一缕光照进来的时候，他靠在窗框上——眼睛闭着，但不是睡着了。他的手指无意识地转着那朵枯花的花茎。", characterLine: "以后——你可以睡我的床。我睡地上。就像小时候我睡我妈床下面一样。你没听错——这是我过夜的方式。但如果你介意的话——我可以试着改。", isEnding: true, endingLabel: "✦ 他可以试着改" },
        { id: "ly-home-end-spicy", narrative: "他没有关门。你听到他在房间里走了一会儿，然后躺到了你旁边。他的背贴着你的背——不重，但很确定。体温透过衣料传过来，比任何话语都清楚。", characterLine: "我以为我这辈子不会再让任何人躺在这张床上。你是例外。别问我为什么——我要是能解释就不会让你留下来了。手——放这里。对。就这样。别动。", isEnding: true, endingLabel: "🔥 他把你的手放在自己胸口上" },
      ]
    },
  ],
  qinhuai: [
    {
      id: "qh-code",
      scoreThreshold: 30,
      title: "破解密码",
      preview: "秦淮说他发现了一个加密算法需要你帮忙测试。凌晨两点——他的实验室。他说他准备了额外的咖啡。办公室里只有一把椅子——他说你可以坐他的。",
      characterLine: "我需要第二双眼睛。这个算法很复杂——你的思维方式刚好跟我不一样。来实验室。我保证不让你白熬夜。如果你累了——沙发可以躺。我睡过很多次，还算舒服。",
      acceptScene: "qh-code-1",
      rejectLine: "……好吧。我一个人也可以。但如果你改主意——我会在实验室待到天亮。我的终端一直在线。",
      scenes: [
        { id: "qh-code-1", narrative: "凌晨的实验室有一种特殊的安静——只有他敲键盘的声音，和你的呼吸。他忽然停下来，转过椅子看着你。他的眼镜反着屏幕的蓝光，看不清表情。", characterLine: "你刚才的想法——把概率权重放在第三个维度——我之前完全没有考虑到。你这种直觉从哪里来的？别说是运气。运气不符合概率论。", choices: [{ id: "explain", label: "在白板上写出思路", nextScene: "qh-code-2a" }, { id: "mystery", label: "笑着说保密", nextScene: "qh-code-2b" }] },
        { id: "qh-code-2a", narrative: "你把思路写在了白板上。他看了很久——然后拿起笔，在你的公式旁边加了注释。不是修改——是补充。这意味着他认可了你的原创性。他的手停在你的公式下面——好像不舍得擦掉。", characterLine: "这个解法——我想把你的名字作为共同作者。如果你拒绝我也不会生气。但我觉得你应该被看到。这个领域里被看到的人太少——而你的思路不应该被埋没。", choices: [{ id: "agree", label: "高兴地接受", nextScene: "qh-code-end-good" }, { id: "humble", label: "说只是运气", nextScene: "qh-code-end-spicy" }] },
        { id: "qh-code-2b", narrative: "你不肯说。他推了推眼镜，椅子滑到你面前——距离突然缩短到一个不太专业的范围。你闻到他咖啡里的糖放了三块——他在实验室档案里写过，焦虑的时候糖会多加。", characterLine: "你有个秘密。我尊重秘密——我自己就有很多。但你的秘密让我分心了。我不喜欢分心。你打算怎么负责？——等等，我不是那个意思。好吧，也许我就是那个意思。", choices: [{ id: "close", label: "靠近他", nextScene: "qh-code-end-spicy" }, { id: "laugh", label: "笑着问他是不是紧张", nextScene: "qh-code-end-good" }] },
        { id: "qh-code-end-good", narrative: "他摘下眼镜揉了揉眼睛——这是他极度认可的信号。实验室里的咖啡凉了，天也快亮了。他在你的名字旁边画了一颗星——然后飞快地擦掉了。", characterLine: "这篇论文——如果我们一起发表，可能会改变这个领域的范式。你愿意跟我合作吗？不只是这篇——以后的项目。我发现——有你在旁边的时候，我的计算错误率下降了37%。这是统计显著的。", isEnding: true, endingLabel: "✦ 统计显著的37%" },
        { id: "qh-code-end-spicy", narrative: "天快亮的时候他睡着了——在椅子上。头歪到一个不太可能舒服的角度。你给他披外套的时候他醒了——眼神迷茫，然后聚焦在你脸上。那种表情就像一个精密的仪器突然短路了。", characterLine: "……你还在。我以为你会走。你知道吗——我在论文里引用了一个变量，叫'观测者效应'。意思是有观察者在场的时候，实验结果会不同。你就是那个变量。别走。天还没亮。", isEnding: true, endingLabel: "🔥 他抓住了你的手腕——力度刚好" },
      ]
    },
    {
      id: "qh-signal",
      scoreThreshold: 60,
      title: "信号追踪",
      preview: "那个未知信号又出现了。秦淮说需要实地追踪——他要你一起去。目的地：废弃的卫星接收站。他说那里在冷战时期发生过一些官方记录上没有的事。",
      characterLine: "信号源在城外。我需要去现场。一个人去不安全——不是因为危险，是因为我可能会忽略什么东西。你来。带上外套。还有——如果看到任何你觉得不正常的东西，马上告诉我。你的直觉比我的算法有时更准。",
      acceptScene: "qh-signal-1",
      rejectLine: "……好吧。我带上定位器。如果你改主意——我的终端一直在线。我会在实验室等你的消息——直到天亮。",
      scenes: [
        { id: "qh-signal-1", narrative: "废弃的接收站在月光下像一个巨大的骷髅。秦淮拿着探测器走在前面——你注意到他手指的细微颤抖。不是害怕——是兴奋。解谜的兴奋——你见过他在实验室里解出难题时的表情，一模一样。", characterLine: "信号很强。就在这栋楼里。你跟在我后面——不要碰任何你认不出的设备。如果看到光源——马上告诉我。这些东西可能还有残留电源。", choices: [{ id: "follow", label: "紧跟在他后面", nextScene: "qh-signal-2a" }, { id: "explore", label: "独自搜索另一侧的档案室", nextScene: "qh-signal-2b" }] },
        { id: "qh-signal-2a", narrative: "你们在地下三层发现了发射源——一台冷战时期的加密通讯设备，仍在运行。秦淮蹲下来检查线路，你举着手电。光束里灰尘飞舞——像下了一场不会化的雪。", characterLine: "这是三十年前的军方设备。发射者已经不在了——但信号还在循环。你知道这意味着什么吗？有人在三十年前设置了一个永远不会停的信号——他在等一个永远不会来的接收者。", choices: [{ id: "decode", label: "帮他一起解码", nextScene: "qh-signal-end-good" }, { id: "touch", label: "在他旁边静静陪着", nextScene: "qh-signal-end-spicy" }] },
        { id: "qh-signal-2b", narrative: "你独自搜索的时候发现了一间档案室。墙上挂着一幅地图——标记着你完全看不懂的坐标。秦淮从背后进来的时候——你没听到他的脚步——你的肩膀撞到了他的胸口。他稳住你的时候，手在你腰上多停了一秒。", characterLine: "你找到了通讯日志室——比我快。你的直觉再次让我不舒服。别动——你头发上有一片灰尘。我来——", choices: [{ id: "let-him", label: "让他帮你", nextScene: "qh-signal-end-spicy" }, { id: "show", label: "给他看地图上的坐标", nextScene: "qh-signal-end-good" }] },
        { id: "qh-signal-end-good", narrative: "解码完成。信号内容是一串坐标——指向研究城北部的废弃天文台。秦淮在白板上画出轨迹的时候，眼睛里有着一种你从没见过的光。", characterLine: "这个信号的内容——是我们这个领域三十年来一直在找的答案。而找到它的是你和我——不是我一个人。我们。我要在论文里用这个词——显得不像我了，但这次准确。", isEnding: true, endingLabel: "✦ 他说了'我们'" },
        { id: "qh-signal-end-spicy", narrative: "他帮你拨掉头发上的灰尘的时候，手指从你的耳垂滑过——然后停在了你的下颌线上。动作极轻，轻到你以为是无意的——但他没有收回去。", characterLine: "有件事我需要验证——我在论文里不能写这个。但你在这里的时候，我的心率变异指数偏离了所有预测模型。这不是电磁干扰。这是——某种我不熟悉的变量。解释给我听。", isEnding: true, endingLabel: "🔥 他的心率偏离了所有模型" },
      ]
    },
    {
      id: "qh-confess",
      scoreThreshold: 85,
      title: "公式之外",
      preview: "秦淮说他发现了一个新的变量——不是数据，是感受。他想在实验室之外跟你聊这件事。地点选在了天文台——他说那里比其他地方更具统计意义。",
      characterLine: "我写了一篇新的论文——但我没法发表。因为数据来源是你。我试图建立一个模型来解释——我对你的反应。结论是——没有模型。不存在模型。你是我的自变量——我控制不了你。",
      acceptScene: "qh-confess-1",
      rejectLine: "……我理解。这是个错误的假设。我会删除这个变量。恢复之前的模型——就像什么都没发生过。",
      scenes: [
        { id: "qh-confess-1", narrative: "他没有在实验室见你——而是在研究城的天文台。他调整望远镜的时候，手指的动作比做实验时慢得多。星空铺在穹顶上——每一颗都比他实验室的屏幕更亮。", characterLine: "我一辈子都在计算概率。但我算不出你下一步会说什么。这不合理——但我不想解决它。我想保持这种不确定性。这在我的职业生涯中是第一次——我想要一个无法验证的假设。", choices: [{ id: "kiss", label: "吻他", nextScene: "qh-confess-2a" }, { id: "smile", label: "对他微笑不回答", nextScene: "qh-confess-2b" }] },
        { id: "qh-confess-2a", narrative: "你吻他的时候他的眼镜差点掉下来。他没有推开——而是扶稳了眼镜，然后认真地看着你，像在观察一个全新的数据点。然后他摘掉眼镜，回吻了你——嘴唇的角度精确得像计算过的。但呼吸不是。呼吸是乱的。", characterLine: "……这个数据我需要反复验证。不要走。今晚我需要更多的采样。如果你觉得速度太快——告诉我。我虽然没有这方面的经验——但我的学习曲线很陡。", choices: [{ id: "stay-kiss", label: "继续吻他", nextScene: "qh-confess-end-spicy" }, { id: "slow", label: "说慢慢来", nextScene: "qh-confess-end-good" }] },
        { id: "qh-confess-2b", narrative: "你只是微笑。他看着你的表情，然后转过身去调整望远镜——但他耳朵尖红了。秦淮。天才研究员。耳朵红得像一个犯了错的学生。他假装在调焦距，但手在轻微地抖。", characterLine: "……我不该让你来天文台的。现在全部的星星都不如你那个表情让我分心。你赢了——这个变量我删不掉。我删了三次——每次都恢复了备份——我不打算删第四次了。", choices: [{ id: "hold-hand", label: "牵他的手", nextScene: "qh-confess-end-spicy" }, { id: "stars", label: "陪他看星星", nextScene: "qh-confess-end-good" }] },
        { id: "qh-confess-end-good", narrative: "你们在天文台待到日出。他在笔记本上写了一行字——然后划掉，又写了一行——然后又划掉。最后只留下两个符号。你看不懂——但你知道那代表什么。", characterLine: "我把结论简化成了两个符号。这是物理学的表达方式——越重要的结论，公式越简洁。这两个符号——左边是你，右边是我。中间的空格——是我们还没定义的东西。我想留给你来填。", isEnding: true, endingLabel: "✦ 中间的空格留给你填" },
        { id: "qh-confess-end-spicy", narrative: "你的手掌覆在他的手背上。他的手指在你的掌心下翻过来——十指交扣。这个动作不是计算出来的——因为他没有犹豫。在秦淮身上，没有犹豫意味着绝对的确定。", characterLine: "手心在出汗——这是交感神经系统的反应。理论上可以用β受体阻滞剂抑制——但我不想。我想保留这个数据。我想记录每一次因为触碰你而产生的生理变化。这是我的新课题——课题代号是你的名字。", isEnding: true, endingLabel: "🔥 课题代号是你的名字" },
      ]
    },
  ],
  fuyanzhi: [
    {
      id: "fy-session",
      scoreThreshold: 30,
      title: "特别诊疗",
      preview: "傅衍之建议把每周的诊疗改成两次。他说你的案例比较特殊——需要更密集的关注。时间定在周四晚上——这个时段通常不开放给患者。",
      characterLine: "我想把你的预约频率调整一下。不是因为你病情加重——是因为我对你的进展产生了学术兴趣。如果你不介意的话——当然你也可以介意。你有充分的选择权。",
      acceptScene: "fy-session-1",
      rejectLine: "没关系。我们保持现在的频率。不过——下次见。我不会因为你的拒绝就改变对你的评估——我是一个专业的医生。至少表面上是的。",
      scenes: [
        { id: "fy-session-1", narrative: "第二次诊疗安排在周四晚上——这个时间通常不开放。他的白大褂还是那么干净，但今天他没有坐在办公桌后面，而是坐在你对面的沙发上。膝盖几乎碰到你的——这个细节他没有纠正。", characterLine: "今天我们换个方式。不按标准的诊疗流程来。你随便说，我随便听。有时候规则本身就是一种束缚。你觉得呢？当然——你也可以选择按流程来。主导权在你。", choices: [{ id: "free", label: "自由地聊任何事", nextScene: "fy-session-2a" }, { id: "test", label: "问他为什么对你特别", nextScene: "fy-session-2b" }] },
        { id: "fy-session-2a", narrative: "你们聊了两个小时——不是医生和患者，就像两个人在深夜的咖啡馆。他偶尔会在笔记本上写什么，但每次写完都会把本子转过来让你看——你注意到他今天的字比平时潦草。", characterLine: "今天不是诊疗。我想——我们把今天当成别的什么。下次周四晚上——还是这个时间。你可以拒绝。但我注意到你今天笑了六次。在正式诊疗中你从不笑——这不值得分析一下吗？", choices: [{ id: "agree", label: "答应下次还来", nextScene: "fy-session-end-good" }, { id: "question", label: "问他为什么数笑", nextScene: "fy-session-end-spicy" }] },
        { id: "fy-session-2b", narrative: "你问他为什么对你特别。他沉默了三秒钟——对他来说是很长的时间。然后他摘掉了眼镜。傅衍之摘眼镜意味着他在做一个重要决定——你从其他病人的描述里知道这个细节。", characterLine: "因为你不像一个病例。你像一个——我很想拆开看看里面是什么的谜题。不要误会——我不是对每个患者都有这种感觉。实际上，只有你。你让我对精神科的职业边界产生了质疑。", choices: [{ id: "accept", label: "说你可以配合他的研究", nextScene: "fy-session-end-spicy" }, { id: "boundary", label: "提醒他职业边界", nextScene: "fy-session-end-good" }] },
        { id: "fy-session-end-good", narrative: "他收起了笔记本。这是一个前所未有的动作——傅医生从不提前结束记录。他站起来送你到门口，手搭在门把上——没有转。", characterLine: "下次过来的时候——不要在前台登记。直接上楼。我会跟护士站说你是我的私人访客——不是病人。如果你觉得这个安排不合适——我们就恢复原样。但我想你应该不会。", isEnding: true, endingLabel: "✦ 私人访客——不是病人" },
        { id: "fy-session-end-spicy", narrative: "他说完那些话之后没有退开。两个人之间的距离变成了一个不太符合诊疗规范的长度。他的白大褂擦过你的手臂——衣料很凉，像他给人的第一印象。", characterLine: "你知道精神科医师最重要的职业道德是什么吗？是保持专业距离。我今天不太想保持——所以我把听诊器留在了办公桌上。这样如果有人说我不专业——我可以辩称没有诊断工具。", isEnding: true, endingLabel: "🔥 他摘掉了听诊器" },
      ]
    },
    {
      id: "fy-dinner",
      scoreThreshold: 60,
      title: "私人晚餐",
      preview: "傅衍之请你在医院附近的一家法餐厅见面。他强调这不是诊疗——是个人邀请。他说那家餐厅的灯光很暗——适合不想被认出来的人。他订了角落的位置。",
      characterLine: "这家餐厅的灯光很暗——适合不想被认出来的人。我订了角落的位置。不用担心碰到同事——我查过了，今晚没有医院的人会来。这种程度的准备——你觉得算不算专业？",
      acceptScene: "fy-dinner-1",
      rejectLine: "……好吧。我以为你会来。不过没关系——我习惯了失望。不是你的问题——是我预设了太高的概率。",
      scenes: [
        { id: "fy-dinner-1", narrative: "他点酒的时候没有看酒单——显然来过很多次。他为你选了一杯酒，然后把菜单推到你面前。他坐的位置刚好能看到整个餐厅——这种警觉性的坐姿不是刻意为之，而是本能。", characterLine: "点你喜欢的——但让我猜一猜你会点什么。你有一种让专业人士想分析的冲动。不过今晚我不分析。今晚我只是——一个想和你吃饭的人。这个身份对我来说很陌生——但我想试试。", choices: [{ id: "let-him", label: "让他替自己点", nextScene: "fy-dinner-2a" }, { id: "order", label: "自己决定", nextScene: "fy-dinner-2b" }] },
        { id: "fy-dinner-2a", narrative: "他点了一桌你全喜欢吃的东西——每一个选择都精准得可怕。前菜是你上周无意中提到但从未正式说过的菜。你问他怎么知道的——他只是笑了笑。", characterLine: "观察了你这么久，如果连你喜欢吃什么都不知道，我这个观察者也太不合格了。今晚我很放松——可能是因为你在这里——也可能不是。我不擅长分辨自己的状态——这是一个罕见的自白。", choices: [{ id: "thanks", label: "真诚道谢", nextScene: "fy-dinner-end-good" }, { id: "touch", label: "在桌下碰他的膝盖", nextScene: "fy-dinner-end-spicy" }] },
        { id: "fy-dinner-2b", narrative: "你自己点的菜。他看起来很高兴——一个出乎意料的选择会让他重新校准对你的判断，而他享受这个过程。他悄悄在手机备忘录里记了什么。", characterLine: "你总在打破我的预设。这很烦人——也很迷人。多吃一点。然后告诉我你为什么会做那些选择。每一个选择背后都有逻辑——即使你自己以为自己是在随机行动。我想听。", choices: [{ id: "explain", label: "详细解释你的选择逻辑", nextScene: "fy-dinner-end-good" }, { id: "mystery", label: "说没有逻辑全凭感觉", nextScene: "fy-dinner-end-spicy" }] },
        { id: "fy-dinner-end-good", narrative: "结账的时候他把账单直接给了服务生——甚至没让你看一眼。在门口，他帮你穿外套的动作极自然。然后他停了一下——似乎在做一个决定。", characterLine: "谢谢你来。我很少跟别人吃晚饭——不是没时间，是没动力。你给了我动力。下次的餐厅我已经选好了——但我不告诉你是哪家。我喜欢看你被惊喜的表情。", isEnding: true, endingLabel: "✦ 他喜欢看你被惊喜的表情" },
        { id: "fy-dinner-end-spicy", narrative: "你说「全凭感觉」的时候他的表情变了——那个关于混沌系统的理论框架似乎在你身上失效了。他把酒杯转了半圈，然后往前倾了身体，双肘撑在桌上。", characterLine: "全凭感觉是一个我不敢用的表达——在我的专业里，感觉是需要被拆解的症状。但你让我想保留它。保留一些不需要分析的东西。比如你的手在桌上——离我就这么近。你觉得我是有意的吗？", isEnding: true, endingLabel: "🔥 你觉得我是有意的吗" },
      ]
    },
    {
      id: "fy-late",
      scoreThreshold: 85,
      title: "深夜来电",
      preview: "凌晨一点半，他的电话打到你手机上。这个电话本身就是一个不正常的事件——傅衍之从不主动联系患者。电话接通后他沉默了五秒——你听到了他在用指尖敲桌面的声音，那是他的习惯动作。",
      characterLine: "抱歉这么晚打给你。但我看了你的档案——不是今晚，我是说从头到尾重新看了一遍——然后发现我没办法等到明天。你今天过得怎么样？别回答标准答案。我今天不想当医生。",
      acceptScene: "fy-late-1",
      rejectLine: "……我明白了。晚安。这个电话从来没有发生过。明天的事明天再说——明天我会假装今晚不存在。",
      scenes: [
        { id: "fy-late-1", narrative: "他在电话那边的声音比平时低——也或许是因为夜深了，所有声音听起来都更低。背景很安静，只有偶尔翻纸的声音。你听到他把什么东西放在桌上——应该是眼镜。", characterLine: "我在看你的初诊记录。你知道我在上面写了什么吗——我写的是：注意。然后画了两条下划线。我从来不画下划线。那个红色的墨水——是我从院长办公室借的。院长不知道。", choices: [{ id: "stay", label: "在电话里陪他", nextScene: "fy-late-2a" }, { id: "go", label: "说你需要睡了", nextScene: "fy-late-2b" }] },
        { id: "fy-late-2a", narrative: "电话持续了一个半小时。你不知道他什么时候摘掉了眼镜——但你听到了他把它放在桌上的声音。他的声音越来越低，低到你需要屏住呼吸才能听清。", characterLine: "我今晚大概睡不了了。不是因为你的档案——是因为你的声音在我脑子里不肯出去。明天你来诊室——但我可能会走神。你要负责。这是医学建议——来自一个可能不太客观的医生。", choices: [{ id: "keep", label: "继续陪他聊", nextScene: "fy-late-end-spicy" }, { id: "meet", label: "答应明天去诊室", nextScene: "fy-late-end-good" }] },
        { id: "fy-late-2b", narrative: "你说你需要睡了。他没有挽留——但他的呼吸在电话那边停了一秒。然后他说了一句你很久以后才会明白分量的话。挂电话之前他加了一句——声音轻到几乎听不见。", characterLine: "好。晚安。但明天醒来第一个想的人如果是我——请告诉我。我需要这个数据点。如果不想也无所谓——我只是需要一个数据点。不是需要你。好吧——也是需要你。", choices: [{ id: "text", label: "挂了电话后给他发消息", nextScene: "fy-late-end-spicy" }, { id: "sleep", label: "真的去睡了", nextScene: "fy-late-end-good" }] },
        { id: "fy-late-end-good", narrative: "第二天早上你醒来的时候，手机上有一条新消息。发送时间是你挂电话后的四分钟——他打了一段又删，删了又打。最后发出来的只有十二个字。", characterLine: "今天的预约改在下午五点。不是诊疗。傅衍之。", isEnding: true, endingLabel: "✦ 十二个字——不是诊疗" },
        { id: "fy-late-end-spicy", narrative: "你挂了电话后给他发了消息——只写了一行：你还在吗。他秒回了三个字——然后显示正在输入，显示了三分钟，最后什么也没发出来。电话响了。", characterLine: "我在。我刚才打了很长一段话然后删了。因为我发现自己说不出一句不带诊断性质的话。所以我不说了。你今晚做的任何事——都不需要被分析。包括——这个时间还没睡。包括——接了这通电话。包括——让我想见到你。", isEnding: true, endingLabel: "🔥 他说了三遍'包括'" },
      ]
    },
  ],
};
