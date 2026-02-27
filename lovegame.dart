import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'dart:math' as math;
import 'dart:convert';

math.Random rand = math.Random();
String responseM = "等你好久了";
String responseF = "回來了嗎~";
String luck = "";
Color myColor = Colors.black12;
String questionBank = "";

const Color kPrimaryPink = Color(0xFFE91E63);
const Color kPrimaryBlue = Color(0xFF3F51B5);
const Color kDeepPurple = Color(0xFF512DA8);
const Color kDarkBg = Color(0xFF1A1A2E);
const Color kCardBg = Color(0xFF16213E);
const Color kGold = Color(0xFFFFD54F);

void main() {
  runApp(MaterialApp(
    home: const SafeArea(child: WelcomePage()),
    debugShowCheckedModeBanner: false,
    theme: ThemeData(
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: Colors.white,
          letterSpacing: 1.2,
        ),
        iconTheme: IconThemeData(color: Colors.white),
      ),
    ),
  ));
}

class WelcomePage extends StatelessWidget {
  const WelcomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF0F0C29), Color(0xFF302B63), Color(0xFF24243E)],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [kPrimaryPink.withOpacity(0.8), kGold.withOpacity(0.8)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: kPrimaryPink.withOpacity(0.4),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: const Icon(Icons.favorite, size: 50, color: Colors.white),
              ),
              const SizedBox(height: 40),
              Text(
                '戀愛之旅',
                softWrap: true,
                style: TextStyle(
                  fontSize: 60,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 8,
                  foreground: Paint()
                    ..shader = ui.Gradient.linear(
                      const Offset(0, 100),
                      const Offset(100, 50),
                      <Color>[Colors.pinkAccent, Colors.yellow],
                    ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Love Game',
                style: TextStyle(
                  fontSize: 18,
                  letterSpacing: 6,
                  color: Colors.white.withOpacity(0.5),
                  fontWeight: FontWeight.w300,
                ),
              ),
              const SizedBox(height: 50),
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(30),
                  gradient: const LinearGradient(colors: [kPrimaryPink, kDeepPurple]),
                  boxShadow: [
                    BoxShadow(
                      color: kPrimaryPink.withOpacity(0.4),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: ElevatedButton(
                  child: const Padding(
                    padding: EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                    child: Text('開始遊戲', style: TextStyle(fontSize: 26, letterSpacing: 4)),
                  ),
                  style: ElevatedButton.styleFrom(
                    elevation: 0,
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
                  ),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => const SexChoose()),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SexChoose extends StatelessWidget {
  const SexChoose({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Flexible(
            flex: 1,
            child: GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => SexMale()));
                questionBank = questionBankMale;
              },
              child: Container(
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFF1A237E), Color(0xFF42A5F5), Color(0xFF90CAF9)],
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.15),
                        border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                      ),
                      child: const Icon(Icons.male, size: 45, color: Colors.white),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      "男",
                      style: TextStyle(
                        fontSize: 50,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 4,
                        shadows: [Shadow(color: Colors.black38, offset: Offset(2, 2), blurRadius: 6)],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          Flexible(
            flex: 1,
            child: GestureDetector(
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => SexFemale()));
                questionBank = questionBankFemale;
              },
              child: Container(
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [Color(0xFF880E4F), Color(0xFFE91E63), Color(0xFFF48FB1)],
                  ),
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.15),
                        border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                      ),
                      child: const Icon(Icons.female, size: 45, color: Colors.white),
                    ),
                    const SizedBox(height: 20),
                    const Text(
                      "女",
                      style: TextStyle(
                        fontSize: 50,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 4,
                        shadows: [Shadow(color: Colors.black38, offset: Offset(2, 2), blurRadius: 6)],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

Widget _buildDialogueBubble(String text, List<Color> gradientColors) {
  return Container(
    width: 340,
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
    decoration: BoxDecoration(
      color: kCardBg.withOpacity(0.9),
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: Colors.white.withOpacity(0.15), width: 1.5),
      boxShadow: [
        BoxShadow(color: gradientColors[0].withOpacity(0.25), blurRadius: 20, spreadRadius: 2),
      ],
    ),
    child: Center(
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w500,
          height: 1.5,
          foreground: Paint()
            ..shader = ui.Gradient.linear(
              const Offset(0, 0),
              const Offset(200, 0),
              gradientColors,
            ),
        ),
      ),
    ),
  );
}

Widget _buildCharacterImage(String url) {
  return Container(
    width: 300,
    height: 350,
    decoration: BoxDecoration(
      color: Colors.white.withOpacity(0.08),
      borderRadius: BorderRadius.circular(30),
      border: Border.all(color: Colors.white.withOpacity(0.1), width: 2),
      boxShadow: [
        BoxShadow(color: Colors.black.withOpacity(0.3), blurRadius: 20, spreadRadius: 5),
      ],
    ),
    child: ClipRRect(
      borderRadius: BorderRadius.circular(28),
      child: Image(image: NetworkImage(url), fit: BoxFit.contain),
    ),
  );
}

Widget _buildActionButtons({
  required VoidCallback onInteract,
  required VoidCallback onAdventure,
  required VoidCallback onDivination,
  required Color accentColor,
}) {
  Widget actionBtn(String label, IconData icon, VoidCallback onPressed, {bool isPrimary = false}) {
    return isPrimary
        ? Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              gradient: LinearGradient(colors: [accentColor, kDeepPurple]),
              boxShadow: [
                BoxShadow(color: accentColor.withOpacity(0.35), blurRadius: 12, offset: const Offset(0, 4)),
              ],
            ),
            child: ElevatedButton.icon(
              icon: Icon(icon, size: 22),
              label: Text(label, style: const TextStyle(fontSize: 20, letterSpacing: 2)),
              style: ElevatedButton.styleFrom(
                elevation: 0,
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              onPressed: onPressed,
            ),
          )
        : OutlinedButton.icon(
            icon: Icon(icon, size: 18, color: Colors.white70),
            label: Text(label, style: const TextStyle(fontSize: 16, color: Colors.white70)),
            style: OutlinedButton.styleFrom(
              side: BorderSide(color: Colors.white.withOpacity(0.25)),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            onPressed: onPressed,
          );
  }

  return Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
    child: Row(
      children: [
        Expanded(child: actionBtn("互動", Icons.chat_bubble_outline, onInteract)),
        const SizedBox(width: 12),
        Expanded(flex: 2, child: actionBtn("踏上旅途", Icons.explore, onAdventure, isPrimary: true)),
        const SizedBox(width: 12),
        Expanded(child: actionBtn("占卜", Icons.auto_awesome, onDivination)),
      ],
    ),
  );
}

class SexMale extends StatefulWidget {
  SexMale({Key? key}) : super(key: key);
  @override
  State<SexMale> createState() => _SexMale();
}

class _SexMale extends State<SexMale> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(title: const Text('男性之旅')),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0D1B2A), Color(0xFF1B3A5C), Color(0xFF3A7BD5)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 16),
              _buildDialogueBubble("$responseM", [Colors.pinkAccent, Colors.yellow]),
              const Spacer(),
              _buildCharacterImage("https://cdn.pixabay.com/photo/2020/11/16/17/04/girl-5749591_960_720.png"),
              const Spacer(),
              _buildActionButtons(
                accentColor: kPrimaryBlue,
                onInteract: () => setState(interactionMale),
                onAdventure: () => Navigator.push(context, MaterialPageRoute(builder: (context) => QuestionPage())),
                onDivination: () => Navigator.push(context, MaterialPageRoute(builder: (context) => Divination())),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class SexFemale extends StatefulWidget {
  SexFemale({Key? key}) : super(key: key);
  @override
  State<SexFemale> createState() => _SexFemale();
}

class _SexFemale extends State<SexFemale> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(title: const Text('女性之旅')),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1A0A1E), Color(0xFF5C1A3A), Color(0xFFD5436A)],
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              const SizedBox(height: 16),
              _buildDialogueBubble("$responseF", [Colors.purpleAccent, Colors.yellowAccent]),
              const Spacer(),
              _buildCharacterImage("https://cdn.pixabay.com/photo/2022/06/15/13/39/man-7263965_960_720.png"),
              const Spacer(),
              _buildActionButtons(
                accentColor: kPrimaryPink,
                onInteract: () => setState(interactionFemale),
                onAdventure: () => Navigator.push(context, MaterialPageRoute(builder: (context) => QuestionPage())),
                onDivination: () => Navigator.push(context, MaterialPageRoute(builder: (context) => Divination())),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class Divination extends StatefulWidget {
  Divination({Key? key}) : super(key: key);
  @override
  State<Divination> createState() => _Divination();
}

class _Divination extends State<Divination> {
  void randomColor() {
    myColor = Color.fromARGB(255, rand.nextInt(256), rand.nextInt(256), rand.nextInt(256));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(title: const Text('占卜')),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0A0A0A), Color(0xFF1A1A2E), Color(0xFF0A0A0A)],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              GestureDetector(
                onTap: () {
                  setState(todayLuck);
                  setState(randomColor);
                },
                child: Container(
                  width: 220,
                  height: 220,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        myColor.withOpacity(0.6),
                        kDeepPurple.withOpacity(0.4),
                        Colors.black,
                      ],
                    ),
                    border: Border.all(color: Colors.white.withOpacity(0.15), width: 2),
                    boxShadow: [
                      BoxShadow(color: myColor.withOpacity(0.4), blurRadius: 40, spreadRadius: 8),
                      BoxShadow(color: kDeepPurple.withOpacity(0.3), blurRadius: 60, spreadRadius: 15),
                    ],
                  ),
                  child: Center(
                    child: Text(
                      luck.isEmpty ? "✦" : luck,
                      style: TextStyle(
                        fontSize: luck.isEmpty ? 40 : 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 4,
                        shadows: [Shadow(color: Colors.white.withOpacity(0.5), blurRadius: 10)],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 40),
              if (luck.isNotEmpty) ...[
                Text(
                  "今日幸運色",
                  style: TextStyle(fontSize: 14, color: Colors.white.withOpacity(0.5), letterSpacing: 4),
                ),
                const SizedBox(height: 12),
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: myColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white.withOpacity(0.3), width: 2),
                    boxShadow: [BoxShadow(color: myColor.withOpacity(0.5), blurRadius: 15, spreadRadius: 3)],
                  ),
                ),
              ],
              if (luck.isEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: 30),
                  child: Text(
                    "點擊水晶球占卜",
                    style: TextStyle(fontSize: 16, color: Colors.white.withOpacity(0.35), letterSpacing: 3),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

void interactionMale() {
  int choice = rand.nextInt(6);
  switch (choice) {
    case 0:
      responseM = "我的名字是君玲！您好啊~";
      break;
    case 1:
      responseM = "喜歡有你在的每一天~";
      break;
    case 2:
      responseM = "能不能讓我一直陪在您的身邊呢？";
      break;
    case 3:
      responseM = "今天晚上想見你~可以嗎?";
      break;
    case 4:
      responseM = "不要走！陪陪我~";
      break;
    case 5:
      responseM = "這裡好黑......可以等等我嗎!?";
      break;
  }
}

void interactionFemale() {
  int choice = rand.nextInt(6);
  switch (choice) {
    case 0:
      responseF = "我是君清！好好記住喔！";
      break;
    case 1:
      responseF = "好美......我是說風景喔！";
      break;
    case 2:
      responseF = "站在你身後守護你，是我今生最大的幸事~";
      break;
    case 3:
      responseF = "你的笑真好看，可以多笑笑嗎!?";
      break;
    case 4:
      responseF = "我不想要你離開，就算只是一眼、一瞬！";
      break;
    case 5:
      responseF = "就這樣靜靜待者吧！";
      break;
  }
}

void todayLuck() {
  int choice = rand.nextInt(8);
  switch (choice) {
    case 0:
      luck = "大吉";
      break;
    case 1:
      luck = "吉";
      break;
    case 2:
      luck = "中吉";
      break;
    case 3:
      luck = "小吉";
      break;
    case 4:
      luck = "末吉";
      break;
    case 5:
      luck = "普普通通";
      break;
    case 6:
      luck = "兇";
      break;
    case 7:
      luck = "大凶";
      break;
  }
}

const String questionBankMale =
'''
1.(1)當我說肚子好痛的時候，以下哪個是直男的反應？①叫我多喝點熱水②拿熱敷袋幫我敷著③在身邊陪著我④想辦法逗我開心
2.(1)我們交往中一起養了一隻貓，我問：「如果分手了，誰來顧貓？」哪個回答最直男？①都聽你的，如果你想養就放你那②我不只愛我們的貓，更愛著你，所以我不會讓這件事發生③這個問題不存在，因為我會一直愛著你④如果真的分手了，我會照顧牠，因為牠是我們共同的回憶
3.(2)你曾說過我是你的初戀，有天我問：「如果我跟你前女友同時掉進水裡，撈上來後都需要做人工呼吸，你會怎麼做？」哪個回答最好？①當然是先幫你做人工呼吸囉②沒有如果，因為我的初戀就是你啊！想什麼呢③請周圍的人幫忙，我幫你做人工呼吸，前女友交給別人④你們又不會碰到，不會有這種事
4.(4)我們現在處於曖昧階段，哪一種告白方式我最能接受？①用社交軟體傳訊息告白②手寫信件告白③在電影院握著我的手告白④出去旅行時準備一場低調浪漫的告白，人不要太多
5.(2)我們是高中的普通同學，我因為下雨沒帶傘站在校門口等雨停，這時有兩把傘的你怎麼做最能拉近關係？①只撐一把傘問我要不要一起走②把另一把傘給我，邀我一起走回家③把傘給我之後自己跑進雨中④說：「沒帶傘啊！真可憐！」然後就走了
6.(4)我們是情侶，如果我說我變胖了，哪個回答不是直男？①怎麼變胖的②去運動啊！都不運動當然胖③不然我們一起去運動吧，強身健體④真的嗎！完全看不出來诶
7.(3)我們是情侶，今天出門約會時對面走來三個長腿美女，等她們走過後我問你：「你覺得我跟她們比，誰的腿比較長？」哪個回答比較不直男？①當然是你的啊！這還用說②說實話，她們的比較長又細③你說誰呢？我剛剛都只看著你，根本沒注意到诶④你要聽實話還是假話
8.(3)我們是情侶，約會時我問你：「你有沒有來過這裡？」你其實來過，哪個回答最保險？①沒有诶！你來過嗎？②有啊！上次跟朋友一起來的③有啊！但這次跟你來感覺完全不一樣！你覺得呢？④沒有！第一次來！
9.(4)浪漫需要天賦，以下哪個是直男式的浪漫？①我喜歡你②你的笑容如春日的陽光③你在我心上④我想要你
10.(4)動漫中女生有很多類型，哪一種會對喜歡的人說出跟心裡想法相反的話？①腹黑②天然呆③三無④傲嬌
''';

const String questionBankFemale =
'''
1.(1)看到妳，我的心就像sin(1/x)一樣不斷加速跳動！妳知道這代表什麼嗎？①我對妳的愛沒有極限②我對妳的愛永遠不變③我對妳的愛一直在提升④我的心中只有妳一人
2.(1)如果妳是sin^2(x)，那我就是cos^2(x)！知道為什麼嗎？因為①我們合而為一②我總是跟在妳身後③妳是我的全部④我對妳的愛說不盡
3.(4)從1到9隨便選一個數，加上15，再乘以2，最後減掉原本那個數。算出來的十位數代表妳，那我是多少呢？①3②1③5④9
4.(1)我想跟妳說「260.0657除以0.5」的答案！妳知道是什麼意思嗎？①我愛你一生一世②我愛妳生生世世③我愛你就是愛你④我愛你愛妳愛妳
5.(1)如果妳是數字220，那我就是284。知道為什麼嗎？因為①妳中有我，我中有妳②愛愛愛妳是吧③妳是我的一切④我總說妳是我的最愛
6.(2)我想跟妳說「I love you till the last digit of π」①我對妳的愛一直循環②我對妳的愛永無止盡③我與妳的愛連在一起④我對妳的愛找不出開始的點
7.(2)自從喜歡上妳之後，我的pH值就改變了①pH=7②pH<7③pOH<7④pOH=7
8.(2)自從愛上了妳，我願做一條RNA，即使是單鏈，也不像DNA總有著「　」，因為我心中只有著妳！請問空格該填什麼？①Adenine②Thymine③Cytosine④Guanine
9.(3)妳知道在我心中，妳獨佔了幾號元素嗎？①1②12③30④80
10.(3)我們兩個之間的關係，妳覺得是哪一種碰撞？①彈性碰撞②非彈性碰撞③完全非彈性碰撞④不碰撞
''';
class QuestionPage extends StatefulWidget {
  const QuestionPage({Key? key}) : super(key: key);
  @override
  State<QuestionPage> createState() => _QuestionPageState();
}

class _QuestionPageState extends State<QuestionPage> {
  late ExamSimulator examSimulator;
  late Question currentQuestion;
  int correctAnswerCount = 0;
  int totalQuestionCount = 0;
  int answeredCount = 0;
  int selectedAnswerIndex = -1;
  bool isExamEnd = false;
  bool isAnswered = false;
  static const List<Color> optionDefaultColors = <Color>[
    Colors.white,
    Colors.white,
    Colors.white,
    Colors.white
  ];
  late List<Color> optionCurrentColors;

  @override
  initState() {
    examSimulator = ExamSimulator();
    examSimulator.prepareExam();
    currentQuestion = examSimulator.getCurrentQuestion();
    correctAnswerCount = 0;
    totalQuestionCount = examSimulator.getNumberOfQuestions();
    answeredCount = 0;
    selectedAnswerIndex = -1;
    isExamEnd = false;
    isAnswered = false;
    optionCurrentColors = optionDefaultColors.toList();
    super.initState();
  }

  void handleOptionButtonOnPress(int selectedOptionIndex) {
    if (isExamEnd == false && isAnswered == false) {
      setState(() {
        selectedAnswerIndex = selectedOptionIndex;
        isAnswered = true;
        answeredCount++;
        optionCurrentColors[currentQuestion.getAnswer()] = Colors.greenAccent;
        if (selectedOptionIndex == currentQuestion.getAnswer()) {
          correctAnswerCount++;
        } else {
          optionCurrentColors[selectedOptionIndex] = Colors.redAccent;
        }
      });
    }
  }

  void handleScreenOnTap() {
    if (isExamEnd == false && isAnswered == true) {
      setState(() {
        isAnswered = false;
        examSimulator.nextQuestion();
        isExamEnd = answeredCount >= totalQuestionCount ? true : false;
        currentQuestion = examSimulator.getCurrentQuestion();
        optionCurrentColors = optionDefaultColors.toList();
      });
    }
  }

  Widget buildQuestion() {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: kCardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: kDeepPurple.withOpacity(0.3)),
        boxShadow: [
          BoxShadow(color: kDeepPurple.withOpacity(0.15), blurRadius: 15, offset: const Offset(0, 4)),
        ],
      ),
      child: Text(
        currentQuestion.getContent(),
        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white, height: 1.6),
      ),
    );
  }

  Widget buildOptions() {
    List<String> options = currentQuestion.getOptions();
    Widget buildOption(String optionContent, int optionIndex) {
      optionContent = optionContent.isNotEmpty ? '${optionIndex + 1}. $optionContent' : optionContent;

      final bool isCorrect = isAnswered && optionIndex == currentQuestion.getAnswer();
      final bool isWrong = isAnswered && optionIndex == selectedAnswerIndex && optionIndex != currentQuestion.getAnswer();

      Color bgColor = kCardBg;
      Color borderColor = Colors.white.withOpacity(0.12);
      if (isCorrect) {
        bgColor = Colors.green.withOpacity(0.25);
        borderColor = Colors.greenAccent;
      } else if (isWrong) {
        bgColor = Colors.red.withOpacity(0.25);
        borderColor = Colors.redAccent;
      }

      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: () => handleOptionButtonOnPress(optionIndex),
            borderRadius: BorderRadius.circular(16),
            splashColor: kPrimaryPink.withOpacity(0.2),
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: bgColor,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: borderColor, width: 1.5),
              ),
              child: Text(
                optionContent,
                style: const TextStyle(fontSize: 15, color: Colors.white, height: 1.4),
              ),
            ),
          ),
        ),
      );
    }

    return Column(
      children: [
        buildOption(options[0], 0),
        const SizedBox(height: 10),
        buildOption(options[1], 1),
        const SizedBox(height: 10),
        buildOption(options[2], 2),
        const SizedBox(height: 10),
        buildOption(options[3], 3),
      ],
    );
  }

  Widget _statChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label, style: TextStyle(fontSize: 11, color: color.withOpacity(0.7))),
          const SizedBox(width: 4),
          Text(value, style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _statChip("總關", "$totalQuestionCount", Colors.white70),
            const SizedBox(width: 8),
            _statChip("挑戰", "$answeredCount", kGold),
            const SizedBox(width: 8),
            _statChip("破關", "$correctAnswerCount", Colors.greenAccent),
          ],
        ),
      ),
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F0C29), Color(0xFF302B63), Color(0xFF24243E)],
          ),
        ),
        child: SafeArea(
          child: InkWell(
            splashColor: Colors.yellow.withOpacity(0.15),
            onTap: handleScreenOnTap,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  buildQuestion(),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Divider(color: Colors.white.withOpacity(0.1), thickness: 1),
                  ),
                  const SizedBox(height: 8),
                  buildOptions(),
                  const SizedBox(height: 20),
                  if (isAnswered && !isExamEnd)
                    Text(
                      "點擊畫面進入下一題",
                      style: TextStyle(color: Colors.white.withOpacity(0.35), fontSize: 13, letterSpacing: 2),
                    ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class Question {
  late final String _content;

  late final List<String> _options;

  late final int _answer;

  Question._();

  Question.empty() {
    _content = '旅程結束，自己評估評估自己的情商吧！不好多言';
    _options = ['', '', '', ''];
    _answer = 0;
  }

  Question.set(String question) {
    String removeEndWithPeriod(String s) {
      return s.endsWith("。") ? s.substring(0, s.length-1) : s;
    }

    int idxAns = question.indexOf("(") + 1;
    int idxContentStart = question.indexOf(")") + 1;
    int idxOptionOne = question.indexOf("①");
    int idxOptionTwo = question.indexOf("②");
    int idxOptionThree = question.indexOf("③");
    int idxOptionFour = question.indexOf("④");

    _content = question.substring(idxContentStart, idxOptionOne).trim();
    int originalAnswer =
    int.parse(question.substring(idxAns, idxAns + 1));

    List<String> s = [];
    s.add(removeEndWithPeriod(question.substring(idxOptionOne + 1, idxOptionTwo).trim()));
    s.add(removeEndWithPeriod(question.substring(idxOptionTwo + 1, idxOptionThree).trim()));
    s.add(removeEndWithPeriod(
        question.substring(idxOptionThree + 1, idxOptionFour).trim()));
    s.add(removeEndWithPeriod(question.substring(idxOptionFour + 1).trim()));
    List<int> t = [0, 1, 2, 3];
    t.shuffle();

    _options = [];
    for (int i = 0; i < 4; i++) {
      _options.add(s[t[i]]);
      if (originalAnswer == t[i] + 1) {
        _answer = i;
      }
    }
  }

  @override
  String toString() =>
      "(${_answer + 1}) $_content ①${_options[0]} ②${_options[1]} ③${_options[2]} ④${_options[3]}";

  String getContent() {
    return _content;
  }

  List<String> getOptions() {
    return _options;
  }

  int getAnswer() {
    return _answer;
  }
}

class ExamSimulator {
  final Question emptyQuestion = Question.empty();
  List<Question> questions = [];
  int currentIndex = 0;

  int getCurrentIndex() {
    return currentIndex;
  }

  int getNumberOfQuestions() {
    return questions.length;
  }

  Question getCurrentQuestion() {
    return currentIndex >= questions.length
        ? emptyQuestion
        : questions[currentIndex];
  }

  bool nextQuestion() {
    if (currentIndex < questions.length) {
      currentIndex++;
      return true;
    } else {
      return false;
    }
  }

  void prepareExam() {
    List<String> lineQuestions = const LineSplitter().convert(questionBank);
    questions.clear();
    for (int i = 0; i < lineQuestions.length; i++) {
      questions.add(Question.set(lineQuestions[i]));
    }
    questions.shuffle();
    currentIndex = 0;
  }
}