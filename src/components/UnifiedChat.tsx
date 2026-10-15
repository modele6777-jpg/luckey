import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { 
  X, Send, Sparkles, TreeDeciduous, Moon, Activity, Bird, Music, Trash2, ChevronRight, ChevronLeft, ChevronDown, HelpCircle, AlertCircle,
  Volume2, VolumeX, Loader2, Sun, Camera, Paperclip, Copy, Check, FileText, FileCode
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp, PersonaType } from "../contexts/AppContext";
import { Streamdown } from "./Streamdown";
import { TTSButton } from "./TTSButton";
import { stopTTS, playConversation, subscribeTTS } from "../utils/tts";
import { getContextAwarePrompts } from "../utils/dynamicContextSuggestions";
import { calculateDetailedSaju } from "../lib/sajuAnalysis";
import { cleanUserMessageDisplay } from "../utils/cleanMessage";
import { ChatInsightsBoardModal } from "./ChatInsightsBoardModal";
import { saveLucyChatSummary } from "../lib/prismOmniSync";
import { invokeLLM } from "../lib/ai";

const PERSONA_CONFIG: Record<PersonaType, { 
  name: string; 
  title: string; 
  emoji: string;
  color: string; 
  hoverColor: string; 
  activeColor: string; 
  bgGlow: string; 
  shadow: string; 
  tag: string; 
  voice: 'Puck' | 'Charon' | 'Kore' | 'Fenrir' | 'Zephyr'; 
  icon: any; 
  placeholder: string; 
  prompts: string[] 
}> = {
  lucy: {
    name: "루시 AI (Lucy AI)",
    title: "우주적인 모든 가호가 싱크된 멀티버스 마스터 가이드",
    emoji: "✨",
    color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    hoverColor: "hover:text-purple-300 hover:bg-purple-500/10",
    activeColor: "bg-purple-600/20 text-purple-200 border-purple-500/50",
    bgGlow: "from-purple-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(168,85,247,0.25)] border-purple-500/30",
    tag: "COSMOS CORE",
    voice: "Kore",
    icon: Sun,
    placeholder: "우주에게 물어보세요...",
    prompts: [
      "생각을 멈추고 신체 느낌에 온전히 항복하는 놓아버림(Letting Go) 가이드",
      "억울함과 자책의 2차 이득(에고의 집착)을 내려놓는 법",
      "손을 펴듯 감정을 가볍게 내려놓는 세도나 릴리징 질문해줘",
      "이 상황을 통제하려는 집착을 내려놓는 법",
      "머릿속 복잡한 고민을 제3자 시선으로 정리해줘",
      "자책과 불안에서 벗어나는 3인칭 자기 대화법 알려줘",
      "내 지금 상황을 10년 뒤 미래 시점에서 바라본다면?",
      "벽에 붙은 파리 시선(Fly-on-the-wall)으로 내 고민 객관화하기",
      "불안한 생각을 시냇물에 흘려보내는 인지 탈융합 명상",
      "내가 통제할 수 있는 것과 없는 것을 칼같이 구분해줘",
      "나의 오늘 전반적인 주파수 상태는 어때?",
      "잠시 마음을 안정시킬 수 있는 질문을 해줘",
      "오늘 내가 품어야 할 우주의 메시지는?",
      "이번 주 나의 운명적 기조와 흐름은?",
      "나의 태생적 잠재력과 영적 과제 검토해줘",
      "최근 느끼는 피로감을 우주적 관점으로 해석한다면?",
      "오늘 나의 핵심 싱크로니시티(동시성) 키워드는?",
      "지금 이 순간 나에게 가장 필요한 차크라 조율법은?",
      "영적 성장을 위해 오늘 실천할 수 있는 작은 의식",
      "우주가 나에게 보내는 보이지 않는 신호는?",
      "내면의 직관력을 한 단계 깨우는 방법",
      "나를 둘러싼 오라 에너지를 정화하고 밝히는 법",
      "삶의 불확실성을 담담히 수용하는 지혜",
      "혼란스러운 생각들을 멈추고 고요를 찾는 호흡",
      "오늘 나를 지켜주는 수호 가이드의 조언",
      "미래에 대한 막연한 두려움을 덜어내는 통찰",
      "내 영혼이 진정으로 갈망하는 성장 방향",
      "오늘 하루 감사할 만한 세 가지 우주적 축복",
      "삶의 매 순간 현존(Presence)을 유지하는 법",
      "가슴 깊은 곳의 답답함을 우주 에너지로 녹여내기",
      "주변의 부정적인 에너지로부터 나를 보호하는 법",
      "나만의 고유한 진동수를 높이는 데일리 루틴",
      "지친 영혼을 감싸주는 따뜻한 우주의 속삭임",
      "내 마음의 중심축을 단단히 세우는 명상적 문장"
    ]
  },
  orange: {
    name: "루시 AI (Lucy AI)",
    title: "루시의 마음치유 채널 (내면아이 보듬기 & 성찰)",
    emoji: "🍊",
    color: "text-orange-400 border-orange-500/20 bg-orange-500/5",
    hoverColor: "hover:text-orange-300 hover:bg-orange-500/10",
    activeColor: "bg-orange-600/20 text-orange-200 border-orange-500/50",
    bgGlow: "from-orange-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(249,115,22,0.25)] border-orange-500/30",
    tag: "MIND SANCTUARY",
    voice: "Kore",
    icon: TreeDeciduous,
    placeholder: "가슴 한구석 시린 그늘을 따스하게 보듬어 줄게. 편하게 털어놓아 봐.",
    prompts: [
      "지금 약간 무기력한데 위로의 말을 해줘",
      "내 내면의 소외된 아이를 다독여줄 수 있을까?",
      "오늘 하루를 정밀하고 포근하게 성찰 명상하는 질문",
      "끝없는 불안감이 엄습할 때 마음을 잡는 법",
      "누군가에게 서운했던 감정이 지워지지 않아",
      "스스로를 자책하고 비난하는 마음을 멈추고 싶어",
      "과거의 상처로부터 안전하게 나를 지키는 위로",
      "오늘 나의 가슴을 가장 따뜻하게 채워줄 칭찬 한마디",
      "외로움이 깊어질 때 나 자신과 대화하는 방법",
      "남들과 비교하며 작아지는 마음을 달래줘",
      "아무것도 하기 싫을 때 나를 다그치지 않는 법",
      "참아왔던 눈물을 편안하게 흘려보내는 안전한 위로",
      "완벽하지 않아도 온전히 사랑받을 자격이 있을까?",
      "거절당할까 봐 두려운 마음을 편안하게 안아주기",
      "오늘 지친 나에게 꼭 필요한 마음의 처방전",
      "마음속 응어리진 화를 부드럽게 녹여내는 대화",
      "나를 진심으로 용서하고 품어주는 호흡",
      "남의 눈치를 보느라 지쳐버린 나를 위한 말",
      "따뜻한 온기를 전하는 오렌지빛 손편지 한 장",
      "혼자 끙끙 앓던 고민을 훌훌 털어놓고 싶어",
      "내 안의 작은 아이에게 건네는 따스한 포옹",
      "상처받은 마음에 새 살이 돋아나는 위로의 문장",
      "오늘 밤 편안하게 잠들 수 있는 마음 토닥임",
      "감정이 널뛸 때 차분하게 중심을 잡는 방법",
      "나의 있는 그대로의 모습을 인정하는 연습",
      "누구에게도 말 못 했던 속마음을 들어줄래?",
      "마음의 짐을 내려놓고 온전히 쉬어가는 세도나 4문답",
      "오늘 끌어당김의 법칙으로 우주에 전달할 긍정 확언",
      "지나간 일에 대한 후회를 털어내는 따뜻한 시선",
      "나를 가장 사랑해 줄 수 있는 사람은 바로 나라는 확신",
      "마음속 응어리를 시원하게 흘려보내는 방하착 호흡",
      "온 세상을 따스하게 감싸는 포근한 햇살 같은 격려"
    ]
  },
  trinity: {
    name: "루시 AI (Lucy AI)",
    title: "루시의 트리니티 오라클 (사주·점성술·타로 데이터 분석)",
    emoji: "🌌",
    color: "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
    hoverColor: "hover:text-yellow-300 hover:bg-yellow-500/10",
    activeColor: "bg-yellow-600/20 text-yellow-200 border-yellow-500/50",
    bgGlow: "from-yellow-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(234,179,8,0.25)] border-yellow-500/30",
    tag: "TRINITY FATE",
    voice: "Kore",
    icon: Sparkles,
    placeholder: "우주의 수많은 별길이 교차하고 있어. 해결하고 싶은 운명선이 있니?",
    prompts: [
      "내 태양·달·상승궁 출생 차트로 읽어보는 내면 심리 패턴",
      "내 별자리와 주변 사람들과의 관계 역학 & 실질적 대처 팁",
      "내 무의식적 감정 패턴을 점성학적 관점에서 솔직하게 분석해줘",
      "오늘 내 기운의 흐름에 어울리는 우주의 처방 한 줄은?",
      "내 타고난 본질의 기운을 차분하고 건조 명확하게 리딩해줘",
      "사주와 점성술을 엮어서 전해주는 강력 조언",
      "재물운과 일적인 기운의 궤도가 지금 어때?",
      "인간관계에서 갈등을 풀 수 있는 우주적 해법",
      "내 사주에서 가장 강한 기운과 보완해야 할 오행",
      "앞으로 겪을 큰 변화와 이에 대처하는 현명한 자세",
      "이직이나 새로운 도전을 하기에 좋은 시기일까?",
      "나의 현재 수호 행성과 그 행성이 전하는 경고",
      "오늘 나에게 행운을 가져다줄 색상과 숫자",
      "답답한 정체기를 뚫고 나아갈 운명적 타이밍",
      "인연의 실타래를 현명하게 정리하는 지혜",
      "현재 내가 집중해야 할 핵심 카르마 과제는?",
      "올해 나의 대운(大運) 흐름과 기회의 문",
      "마음이 갈팡질팡할 때 결단을 내리는 기준",
      "시험이나 계약을 앞두고 기운을 끌어올리는 법",
      "나의 직관력을 시험할 수 있는 오라클 질문",
      "보이지 않는 액운을 피하고 복을 부르는 비결",
      "인생의 터닝포인트에서 마주할 징조들",
      "타고난 사주 오행 중 부족한 기운을 채우는 개운법",
      "현재 나의 인간관계 궁합과 조화로운 소통법",
      "선택의 기로에서 나에게 가장 유리한 방향은?",
      "타로의 메이저 아르카나가 내게 속삭이는 오늘의 상징",
      "내 점성학 천궁도에서 지금 가장 활성화된 별자리 영향",
      "운명의 파도를 슬기롭게 타기 위한 주간 운세 가이드",
      "중요한 사람과의 카르마적 인연 고리 풀기",
      "금전과 번영의 물꼬를 트는 풍수적 오행 조율법",
      "나의 생년월일시가 지닌 고유한 천명과 그릇"
    ]
  },
  aura: {
    name: "루시 AI (Lucy AI)",
    title: "루시의 아우라 바디웰니스 (신체 활력 & 차크라 호흡)",
    emoji: "🌿",
    color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    hoverColor: "hover:text-emerald-300 hover:bg-emerald-500/10",
    activeColor: "bg-emerald-600/20 text-emerald-200 border-emerald-500/50",
    bgGlow: "from-emerald-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(16,185,129,0.25)] border-emerald-500/30",
    tag: "AURA WELLNESS",
    voice: "Kore",
    icon: Activity,
    placeholder: "네 몸의 주파수 안정과 활력을 정밀하게 건강 가이드할게.",
    prompts: [
      "폰과 노트북을 너무 봐서 가슴과 목이 뻐근한데, 1분 스트레칭 알려줘",
      "불면을 예방할 수 있는 정화 심호흡 루틴은?",
      "나를 가뿐하게 정화하고 활력 기운을 주는 차 처방은?",
      "가슴 차크라(아나하타)가 막힌 것 같은데 열어주는 호흡법",
      "머리가 복잡하고 무거울 때 하는 그라운딩 명상법",
      "피로 예방과 신체 에너지 방어를 위한 솔트 웰니스 처방",
      "아침에 눈떠서 기운을 급속 충전하는 활력 포즈",
      "스트레스로 소화가 안 될 때 손쉽게 자극하는 혈자리",
      "온몸의 독소를 배출해주는 따뜻한 아우라 샤워 명상법",
      "눈의 피로와 두통을 가라앉히는 지압법",
      "어깨와 턱의 긴장을 즉시 풀어내는 릴랙스 루틴",
      "점심 식사 후 쏟아지는 졸음을 깨우는 호흡",
      "하체 부종을 완화하고 기혈 순환을 돕는 자세",
      "잠들기 전 5분 동안 온몸을 이완하는 바디스캔 가이드",
      "면역력을 지키기 위한 일상 수분 섭취와 리듬 조율",
      "가슴 답답함을 시원하게 뚫어주는 흉곽 확장 호흡",
      "만성 피로를 덜어내는 에너지 충전 낮잠법",
      "몸의 냉기를 몰아내고 온기를 채우는 티 세레모니",
      "허리 통증을 부드럽게 완화하는 골반 정렬 스트레칭",
      "긴장성 두근거림을 진정시키는 4-7-8 호흡법",
      "하루의 에너지를 균형 있게 분배하는 웰니스 팁",
      "7대 차크라 에너지의 균형 상태를 진단해줘",
      "척추의 유연성을 깨우는 고양이-소 자세 가이드",
      "손발이 차가울 때 체온을 끌어올리는 발목 펌핑 운동",
      "부정적인 감정이 몸에 쌓였을 때 털어내는 바디 셰이킹",
      "맑은 정신을 유지하기 위한 뇌파 조율 528Hz 호흡",
      "깊은 밤 숙면을 유도하는 라벤더빛 이완 심상화",
      "지친 눈과 목 뒤의 림프를 순환시키는 따뜻한 마사지"
    ]
  },
  bluebird: {
    name: "루시 AI (Lucy AI)",
    title: "루시의 블루버드 예술정서 (예술 소리치유 & 시적 교감)",
    emoji: "🐦",
    color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    hoverColor: "hover:text-cyan-300 hover:bg-cyan-500/10",
    activeColor: "bg-cyan-600/20 text-cyan-200 border-cyan-500/50",
    bgGlow: "from-cyan-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(6,182,212,0.25)] border-cyan-500/30",
    tag: "BLUEBIRD ART",
    voice: "Kore",
    icon: Bird,
    placeholder: "맑고 우아한 문장의 울림과 예술 치유의 바이노럴 주파수를 보낼게.",
    prompts: [
      "지금 마음에 짐이 무인 내게, 마법 같은 시와 음악을 어루만져줘",
      "오늘 내가 즉각 시도할 예술 표현 연습 처방 해줘",
      "호오포노포노 치유 기운을 실천에 담는 생각법",
      "슬픔이 밀려올 때 영혼을 맑게 씻어줄 음악 주파수",
      "한 구절의 시로 내 마음을 보듬고 정화하기",
      "내면의 상실감을 예술적 시각으로 승화시키는 질문",
      "메마른 감성을 투명하고 촉촉하게 채워줄 시 한 구절",
      "오늘 내가 영혼의 색채로 그린다면 어떤 색깔일까?",
      "정서적 찌꺼기를 바람 속에 모두 날려 보내는 상상법",
      "마음을 울리는 첼로 선율 같은 따뜻한 위로",
      "마음속 깊은 곳의 고요한 숲으로 떠나는 심상 여행",
      "비 오는 날 창가에 앉아 듣기 좋은 감성 글귀",
      "잃어버린 감수성을 다시 일깨워줄 아름다운 은유",
      "상처 입은 마음에 잔잔한 파도처럼 스며드는 음악 처방",
      "나를 한 편의 서정시로 표현한다면 어떤 문장일까?",
      "말로는 다 표현 못 할 묵직한 감정을 정화하는 예술",
      "영혼의 안식을 주는 푸른 파랑새의 깃털 메시지",
      "기억 저편의 그리움을 따뜻하게 배웅하는 방법",
      "마음의 소음을 투명한 피아노 화음으로 바꾸기",
      "일상의 작은 풍경에서 발견하는 찰나의 미학",
      "고흐의 밤하늘처럼 깊고 빛나는 영혼의 멜로디",
      "마음에 낀 안개를 걷어내는 시적 카타르시스",
      "바람 소리와 나뭇잎 바스락거림을 닮은 자연의 노래",
      "마음의 호수에 잔잔히 피어나는 수련 꽃 한 송이",
      "빛바랜 사진처럼 아련한 추억을 따뜻하게 쓰다듬기",
      "나만의 감정 일기를 한 편의 산문시로 완성해줘",
      "세상의 모든 서툰 마음들을 위한 따스한 자장가",
      "영혼을 투명하게 씻어내는 432Hz 힐링 주파수"
    ]
  },
  muse: {
    name: "루시 AI (Lucy AI)",
    title: "루시의 뮤즈 창조성 (영감 자극 & 창작 장애물 구출)",
    emoji: "🎨",
    color: "text-blue-400 border-blue-500/20 bg-blue-500/5",
    hoverColor: "hover:text-blue-300 hover:bg-blue-500/10",
    activeColor: "bg-blue-600/20 text-blue-200 border-blue-500/50",
    bgGlow: "from-blue-950/20 to-transparent",
    shadow: "shadow-[0_0_30px_rgba(59,130,246,0.25)] border-blue-500/30",
    tag: "MUSE SPARKS",
    voice: "Kore",
    icon: Music,
    placeholder: "갇혀있던 너의 고유한 영감을 더 넓은 세상으로 데려다줄게.",
    prompts: [
      "창의적인 첫 시작을 두려워하는 나를 위한 예술가 영각 축제",
      "내 내면의 복잡한 감정의 소음을 음악적 모티브로 바꾸는 법",
      "고정관념을 부수는 오늘의 수수께끼 질문",
      "아이디어가 완전히 고갈됐을 때 뇌를 깨우는 처방",
      "나만의 독창적인 서사를 풀어내는 데 필요한 단서",
      "내면의 비판가('검열관')를 잠재우고 자유롭게 창작하기",
      "오늘 나의 시각적 상상력을 자극하는 세 가지 단어",
      "지루한 일상을 초현실적인 이야기로 뒤트는 발상법",
      "새로운 도전을 꿈꾸지만 시작이 두려울 때 얻는 영감",
      "막혀있는 작업의 돌파구를 찾는 무작위 발상 기법",
      "세상에 없던 새로운 음악 장르를 상상해 본다면?",
      "나의 실패 경험을 매력적인 예술적 소재로 바꾸기",
      "영감이 번개처럼 번뜩이는 마법 같은 질문 하나",
      "단편적인 생각들을 하나의 매력적인 프로젝트로 엮는 법",
      "익숙한 대상을 완전히 낯설게 바라보는 렌즈",
      "창작 슬럼프를 기분 좋은 휴식과 도약의 기회로 바꾸기",
      "나의 숨겨진 재능과 개성을 드러내는 창작 챌린지",
      "내 안의 예술적 열정에 불을 지피는 강렬한 동기부여",
      "아이디어를 시각화하고 정리하는 브레인스토밍 팁",
      "두 가지 상반된 개념을 융합하여 새로운 컨셉 만들기",
      "우연한 실수에서 걸작의 실마리를 발견하는 법",
      "10분 만에 엉뚱하고 기발한 아이디어 10개 뽑기",
      "틀에 박힌 루틴을 깨부수는 아방가르드적 하루 미션",
      "내가 쓰는 글에 생명력과 몰입감을 불어넣는 묘사법",
      "창작자의 뇌를 자극하는 색채와 질감의 심상화",
      "완벽주의를 내려놓고 첫 번째 초안을 과감히 완성하기",
      "평범한 대화에서 영감을 주는 명대사 뽑아내기",
      "창의력의 스파크를 일으키는 엉뚱한 가상 시나리오"
    ]
  }
};

export function UnifiedChat() {
  const [location, navigate] = useLocation();
  const { 
    isChatOpen, setIsChatOpen, 
    activePersona, setActivePersona, 
    personaMessages, isGenerating, 
    sendUnifiedMessage, chatSuggestions, clearPersonaMessages,
    sharedState
  } = useApp();

  const [input, setInput] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryDone, setSummaryDone] = useState(false);

  const rawNickname = sharedState?.userProfile?.basic?.nickname?.trim();
  const rawName = sharedState?.userProfile?.basic?.name?.trim();
  const userDisplayName = (rawNickname && rawNickname !== '여행자' && rawNickname !== '사용자')
    ? rawNickname
    : ((rawName && rawName !== '여행자') ? rawName : '제제');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    type: string;
    dataUrl?: string;
    textContent?: string;
    size?: number;
    isPdf?: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImageIfNeeded = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1600;
          let width = img.width;
          let height = img.height;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
            const dataUrl = canvas.toDataURL(mimeType, 0.85);
            resolve(dataUrl);
          } else {
            resolve(reader.result as string);
          }
        };
        img.onerror = () => resolve(reader.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type || "";
    const fileName = file.name || "document";
    const fileSize = file.size || 0;
    const isPdf = fileType === "application/pdf" || fileName.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      if (fileSize > 20 * 1024 * 1024) {
        alert("20MB 이하의 PDF 문서 파일만 첨부할 수 있습니다.");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const res = reader.result as string;
        setAttachedFile({
          name: fileName,
          type: "application/pdf",
          dataUrl: res,
          size: fileSize,
          isPdf: true
        });
      };
      reader.onerror = () => {
        alert("PDF 파일을 읽는 도중 오류가 발생했습니다.");
      };
      reader.readAsDataURL(file);
    } else if (fileType.startsWith("image/")) {
      const compressedDataUrl = await compressImageIfNeeded(file);
      setAttachedFile({
        name: fileName,
        type: fileType,
        dataUrl: compressedDataUrl || "",
        size: fileSize,
        isPdf: false
      });
    } else if (fileType.startsWith("text/") || /\.(txt|md|json|csv|log|yaml|yml|tsv|xml|html)$/i.test(fileName)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawText = (reader.result as string) || "";
        const cleanText = rawText.length > 25000 
          ? rawText.slice(0, 25000) + "\n\n[...문서가 길어 앞 25,000자만 첨부되었습니다...]" 
          : rawText;
        setAttachedFile({
          name: fileName,
          type: fileType || "text/plain",
          textContent: cleanText,
          size: fileSize,
          isPdf: false
        });
      };
      reader.readAsText(file);
    } else {
      alert("지원되는 파일 형식: PDF 문서, 이미지(PNG/JPG/WEBP), 텍스트(TXT/MD/JSON/CSV) 문서입니다.");
    }

    // Reset input
    e.target.value = "";
  };
  const [isReadingAll, setIsReadingAll] = useState(false);
  const [isReadingAllLoading, setIsReadingAllLoading] = useState(false);
  const [shuffledPrompts, setShuffledPrompts] = useState<string[]>([]);
  const prevIsChatOpenForPromptsRef = useRef(false);
  const prevPersonaForPromptsRef = useRef<PersonaType | null>(null);

  // Dynamic Context-Aware suggestions computation (syncs with recent dialogue, WHY, and emotions)
  const getContextualPrompts = useCallback((persona: PersonaType, count = 10): string[] => {
    const thread = personaMessages[persona] || [];
    const aiPool = chatSuggestions[persona] || [];
    const fallbackList = PERSONA_CONFIG[persona]?.prompts || [];
    const sajuObj = calculateDetailedSaju(sharedState?.userProfile);
    
    return getContextAwarePrompts({
      persona,
      messages: thread,
      aiSuggestions: aiPool,
      fallbackPrompts: fallbackList,
      activeRoute: location,
      worry: sharedState?.userProfile?.fate?.currentWorry,
      mbti: sharedState?.userProfile?.psych?.mbti || sharedState?.userProfile?.basic?.gender,
      sajuDigest: sajuObj?.shortDigest
    }, count);
  }, [personaMessages, chatSuggestions, location, sharedState]);

  const handleRefreshPrompts = useCallback(() => {
    const nextPrompts = getContextualPrompts(activePersona, 10);
    setShuffledPrompts(nextPrompts);
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activePersona, getContextualPrompts]);

  // Subscribe to global TTS state to determine if conversation mode is active
  useEffect(() => {
    const unsubscribe = subscribeTTS((state) => {
      setIsReadingAll(state.isSpeaking && state.activeText === '__CONVERSATION__');
      setIsReadingAllLoading(state.isLoading && state.activeText === '__CONVERSATION__');
    });
    return unsubscribe;
  }, []);

  // Always use unified Lucy Master
  useEffect(() => {
    if (activePersona !== 'lucy') {
      setActivePersona('lucy');
    }
  }, [activePersona, setActivePersona]);

  // Generate personalized suggestions when chat window opens
  useEffect(() => {
    const isOpening = isChatOpen && !prevIsChatOpenForPromptsRef.current;
    prevIsChatOpenForPromptsRef.current = isChatOpen;

    if (isOpening) {
      const nextPrompts = getContextualPrompts('lucy', 12);
      setShuffledPrompts(nextPrompts);
      if (suggestionsRef.current) {
        suggestionsRef.current.scrollLeft = 0;
      }
    }
  }, [isChatOpen, getContextualPrompts]);

  const currentMessages = personaMessages.lucy || [];
  const currentGenerating = isGenerating.lucy || false;

  const isOpeningRef = useRef(false);
  const isAutoScrollingRef = useRef(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Keep scrolling scoped to the chat viewport. Never use scrollIntoView here:
  // it can move the page/root scroll position and becomes very expensive while
  // images or streamed markdown are changing layout.
  const scrollToBottom = useCallback((smooth = false) => {
    const el = chatContainerRef.current || document.getElementById('unified-chat-messages-container');
    if (!el) return;
    const top = Math.max(0, el.scrollHeight - el.clientHeight);

    isAutoScrollingRef.current = true;
    if (autoScrollTimerRef.current) clearTimeout(autoScrollTimerRef.current);
    autoScrollTimerRef.current = setTimeout(() => {
      isAutoScrollingRef.current = false;
    }, 200);

    if (smooth) {
      el.scrollTo({ top, behavior: "smooth" });
    } else if (el.scrollTop !== top) {
      el.scrollTop = top;
    }
  }, []);

  // Check scroll position to display / hide "Scroll to bottom" button and record user scroll intent
  const handleScroll = useCallback(() => {
    if (isOpeningRef.current || isAutoScrollingRef.current) {
      return; // Do NOT set userScrolledUp while opening or auto-scrolling!
    }
    const el = chatContainerRef.current || document.getElementById('unified-chat-messages-container');
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    // If distance from bottom is more than 80px, the user scrolled up intentionally
    const isScrolledUp = distanceToBottom > 80;
    userScrolledUpRef.current = isScrolledUp;
    setShowScrollBottomBtn(distanceToBottom > 160);
  }, []);

  // Manual scroll to bottom action triggered by button
  const handleScrollToBottom = useCallback(() => {
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    scrollToBottom(false);
  }, [scrollToBottom]);

  // Opening the chat needs one layout pass, not a continuous animation-frame lock.
  // The old loop competed with touch scrolling and made the chat feel laggy.
  useEffect(() => {
    if (!isChatOpen) {
      isOpeningRef.current = false;
      return;
    }

    isOpeningRef.current = true;
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    const rafId = requestAnimationFrame(() => {
      scrollToBottom(false);
      isOpeningRef.current = false;
    });

    return () => {
      cancelAnimationFrame(rafId);
      isOpeningRef.current = false;
    };
  }, [isChatOpen, scrollToBottom]);

  // Scroll to bottom when a new message is received or during streaming generation ONLY if user has not scrolled up
  const prevMsgLengthRef = useRef(currentMessages.length);
  useEffect(() => {
    if (!isChatOpen) return;
    const isNewMsg = currentMessages.length > prevMsgLengthRef.current;
    const isLastMsgUser = currentMessages[currentMessages.length - 1]?.role === 'user';
    prevMsgLengthRef.current = currentMessages.length;

    // If the user just submitted a new message, force scroll to bottom and reset scroll lock
    if (isNewMsg && isLastMsgUser) {
      userScrolledUpRef.current = false;
      setShowScrollBottomBtn(false);
      scrollToBottom(false);
      return;
    }

    // If AI is replying/streaming, ONLY auto-scroll if the user has NOT scrolled up to read earlier messages
    if (!userScrolledUpRef.current) {
      scrollToBottom(false);
    }
  }, [currentMessages, currentGenerating, isChatOpen, scrollToBottom]);

  // Observe content resizing (e.g. streaming markdown expansion or images loading) without overriding user scroll
  useEffect(() => {
    if (!isChatOpen) return;
    const container = chatContainerRef.current || document.getElementById('unified-chat-messages-container');
    if (!container) return;

    let rafId: number | null = null;
    let lastHeight = 0;
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const newHeight = entry ? entry.contentRect.height : 0;
      if (Math.abs(newHeight - lastHeight) < 8) return;
      lastHeight = newHeight;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!userScrolledUpRef.current) {
          scrollToBottom(false);
        }
      });
    });

    resizeObserver.observe(container);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
  }, [isChatOpen, scrollToBottom]);
  const config = PERSONA_CONFIG[activePersona] || PERSONA_CONFIG.lucy;
  const displayPrompts = shuffledPrompts.length > 0 
    ? shuffledPrompts 
    : (PERSONA_CONFIG[activePersona]?.prompts || []).slice(0, 8);
  const ActiveIcon = (activePersona === 'lucy' && location === "/epilogue") ? Moon : config.icon;

  // Horizontal scroll state & controls for PC / Desktop
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleCopyMessage = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((prev) => (prev === index ? null : prev)), 2000);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex((prev) => (prev === index ? null : prev)), 2000);
    }
  };

  const updateScrollButtons = useCallback(() => {
    const el = suggestionsRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    if (!isChatOpen) return;
    const el = suggestionsRef.current;
    if (!el) return;

    const handleWheelNative = (e: WheelEvent) => {
      if (el.scrollWidth > el.clientWidth) {
        e.preventDefault();
        e.stopPropagation();
        const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
        el.scrollLeft += delta * 1.5;
        updateScrollButtons();
      }
    };

    el.addEventListener('wheel', handleWheelNative, { passive: false });
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);

    // Multiple raf/timeouts to ensure proper calculation after DOM render/animation
    updateScrollButtons();
    const t1 = setTimeout(updateScrollButtons, 50);
    const t2 = setTimeout(updateScrollButtons, 200);
    const t3 = setTimeout(updateScrollButtons, 500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      el.removeEventListener('wheel', handleWheelNative);
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [isChatOpen, displayPrompts, updateScrollButtons]);

  const handleScrollLeft = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (suggestionsRef.current) {
      suggestionsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // PC Mouse Click & Drag to scroll
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = suggestionsRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftStartRef.current = el.scrollLeft;
    hasMovedRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const el = suggestionsRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
    }
    el.scrollLeft = scrollLeftStartRef.current - walk;
    updateScrollButtons();
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
    }, 50);
  };

  const handleSend = async (textToSend: string) => {
    if ((!textToSend.trim() && !attachedFile) || currentGenerating) return;
    
    let textMsg = textToSend.trim();
    let imgToSend: string | undefined = undefined;

    if (attachedFile) {
      if (attachedFile.isPdf || attachedFile.type === "application/pdf") {
        imgToSend = attachedFile.dataUrl;
        if (!textMsg) {
          textMsg = `[첨부 PDF 문서: ${attachedFile.name}]\n이 PDF 문서의 주요 내용과 핵심 포인트를 체계적으로 분석하고 친절하게 요약/해설해줘.`;
        }
      } else if (attachedFile.dataUrl) {
        imgToSend = attachedFile.dataUrl;
        if (!textMsg) {
          textMsg = "이 이미지 분석하고 해설해줘!";
        }
      } else if (attachedFile.textContent) {
        textMsg = `[첨부 파일: ${attachedFile.name}]\n${attachedFile.textContent}\n\n${textMsg || "이 파일의 내용을 요약하거나 이에 대해 설명해줘."}`;
      }
    }

    setInput("");
    setAttachedFile(null);
    userScrolledUpRef.current = false;
    setShowScrollBottomBtn(false);
    scrollToBottom(true);

    // Build extra context automatically for deep rich spiritual dialogue
    const depthContext = "\n\n[대화 깊이 규칙: 깊은 교감 모드]\n- 너는 사용자와 깊고 따뜻한 교감을 나누기 위해 답변을 매우 정성스럽고 분량 있는 여러 단락(Paragraphs)의 글(최소 10문장 이상)로 풍부하게 풀어 써줘야 해.\n- 단편적이고 짧은 2~3줄짜리 짧은 대답은 전면 지양하며, 너만의 신비롭고 사랑스러운 은유와 비유, 그리고 감수성을 가득 실어 손편지처럼 충만한 답변으로 영적인 공감을 나누어줘.";
    
    await sendUnifiedMessage(textMsg, activePersona, imgToSend, {
      extraSystemContext: depthContext
    });
  };

  const handleSummarizeChat = async () => {
    if (isSummarizing || currentGenerating) return;
    const msgs = personaMessages[activePersona] || [];
    if (msgs.length < 2) return;

    setIsSummarizing(true);
    try {
      const last10 = msgs.slice(-10);
      const dialogText = last10
        .map((m: any) => {
          const role = m.role === 'user' ? '나' : '루시';
          const text = typeof m.content === 'string' ? m.content : (Array.isArray(m.content) ? m.content.map((p: any) => p.text || '').join('') : '');
          return `${role}: ${text.slice(0, 200)}`;
        })
        .join('\n');

      const summaryMessages = [
        {
          role: 'user' as const,
          content: `다음 대화를 핵심만 3줄 이내로 요약해줘. 감정 상태, 주요 고민, 결론/처방 순서로. 반드시 반말로:\n\n${dialogText}`,
        }
      ];
      const result = await invokeLLM({ messages: summaryMessages });
      if (result && typeof result === 'string') {
        const summaryText = result;
        saveLucyChatSummary(summaryText, activePersona);
        // 루시가 요약을 말풍선으로 전달
        await sendUnifiedMessage(
          `[대화 요약 결과]\n${summaryText}\n\n(Key 사이트에도 자동으로 공유됐어 ✨)`,
          activePersona,
          undefined,
          { extraSystemContext: '\n\n[지시: 이것은 대화 요약 결과야. 루시는 요약 내용을 자연스럽게 읽어주고, 오브와 데이터가 연결됐다고 간단히 알려줘. 1~2문장만.]' }
        );
        setSummaryDone(true);
        setTimeout(() => setSummaryDone(false), 3000);
      }
    } catch (_) {}
    setIsSummarizing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <AnimatePresence>
      {isChatOpen && (
        <div id="unified-chat-portal" className="fixed inset-0 z-[2000] flex items-center justify-end font-sans overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
            onClick={() => { setIsChatOpen(false); stopTTS(); }}
          />

          {/* Floating panel (drawer style) */}
          <motion.div 
            initial={{ x: "100%", opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.9 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            onAnimationComplete={() => {
              if (!userScrolledUpRef.current) {
                scrollToBottom(false);
              }
            }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-[#07080f]/95 border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] backdrop-blur-3xl flex flex-col z-[2100] overflow-hidden"
            style={{ height: "100dvh" }}
          >
            {/* Accent top colored line */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-violet-400/40 via-sky-400/40 via-pink-400/30 to-transparent shrink-0" />

            {/* Persona background glow */}
            <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-b ${config.bgGlow} rounded-full blur-[100px] opacity-60 pointer-events-none transition-all duration-700`} />
            <div className="absolute bottom-20 left-10 w-60 h-60 bg-white/[0.01] rounded-full blur-[80px] pointer-events-none" />

            {/* Header: Unified Lucy Master */}
            <div className="relative z-10 px-5 pt-safe-4 pb-3.5 border-b border-white/[0.08] flex items-center justify-between shrink-0 bg-white/[0.02]">
              <div className="flex items-center gap-3 text-left">
                {/* Subtle Iridescent Lucy Avatar */}
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center p-[1px] bg-gradient-to-tr from-violet-400/50 via-sky-300/40 via-emerald-300/30 to-rose-300/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] shrink-0">
                  <div className="w-full h-full rounded-[15px] bg-[#0c0d16]/90 backdrop-blur-md flex items-center justify-center relative overflow-hidden border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-sky-500/10 to-pink-500/10" />
                    <Sparkles size={18} className="text-purple-200/90 drop-shadow-[0_0_8px_rgba(216,180,254,0.6)] animate-pulse relative z-10" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold tracking-wider text-white">
                    LUCY
                  </h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-purple-200/70 font-mono tracking-wider">
                    MASTER AI
                  </span>
                </div>
              </div>

              {/* Actions: Standalone Install, Play All TTS, Close */}
              <div className="flex items-center gap-2 shrink-0">
                {/* 대화 요약 버튼 (루시→오브 싱크) */}
                {currentMessages.length >= 2 && (
                  <button
                    type="button"
                    onClick={handleSummarizeChat}
                    disabled={isSummarizing}
                    className={`px-2.5 py-1.5 rounded-xl border font-bold text-[11px] sm:text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      summaryDone
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-sky-500/20 hover:bg-sky-500/30 border-sky-500/40 text-sky-200'
                    }`}
                    title="대화 요약 → 오브에 공유"
                  >
                    {isSummarizing ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : summaryDone ? (
                      <Check size={13} className="text-emerald-400" />
                    ) : (
                      <FileText size={13} />
                    )}
                    <span className="hidden sm:inline">
                      {summaryDone ? '공유됨' : '요약·공유'}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsChatOpen(false);
                    stopTTS();
                    navigate('/chat');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-[11px] sm:text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shrink-0"
                  title="라이트 테마 전용 Lucy 열기"
                >
                  <Sparkles size={13} className="text-amber-950" />
                  <span>PRO</span>
                </button>

                {currentMessages.length > 0 && (
                  <button
                    onClick={() => {
                      if (isReadingAll || isReadingAllLoading) {
                        stopTTS();
                      } else {
                        const talkMessages = currentMessages
                          .filter(m => typeof m.content === "string")
                          .map(m => ({
                            role: m.role,
                            content: m.role === "user" ? cleanUserMessageDisplay(m.content as string) : (m.content as string)
                          }));
                        playConversation(talkMessages, config.voice || 'Kore', 'Kore');
                      }
                    }}
                    className={`p-2 rounded-xl bg-white/5 border border-white/10 transition-all active:scale-95 flex items-center justify-center ${
                      isReadingAll || isReadingAllLoading
                        ? "text-blue-400 border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/15"
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title={isReadingAll || isReadingAllLoading ? "음성 재생 중지" : "모든 대화 TTS 음성으로 듣기"}
                  >
                    {isReadingAllLoading ? (
                      <Loader2 size={14} className="animate-spin text-blue-400" />
                    ) : isReadingAll ? (
                      <VolumeX size={14} className="text-blue-400" />
                    ) : (
                      <Volume2 size={14} />
                    )}
                  </button>
                )}

                {currentMessages.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all active:scale-95 flex items-center justify-center cursor-pointer shrink-0"
                    title="대화 초기화 (새 대화 시작)"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                <button 
                  onClick={() => { setIsChatOpen(false); stopTTS(); }}
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center tool-button"
                  title="닫기"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Messages Stream */}
            <div 
              id="unified-chat-messages-container"
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-5 py-5 space-y-5 flex flex-col relative z-10 no-scrollbar select-text premium-scroll"
            >
              {currentMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-30 my-auto">
                  <Sparkles size={44} className="text-white animate-pulse" />
                  <p className="text-xs text-white/60 font-sans leading-relaxed">
                    "우주에게 물어보세요."
                  </p>
                </div>
              )}

              {currentMessages.map((m, i) => {
                const isUser = m.role === "user";
                if (!isUser && !m.content) return null;
                const align = isUser ? "justify-end" : "justify-start";
                const wrapBorder = isUser 
                  ? "bg-gradient-to-tr from-[#3b82f6]/95 to-[#2563eb]/95 text-white rounded-br-none shadow-[0_8px_25px_-5px_rgba(59,130,246,0.5)] border-transparent" 
                  : "bg-white/[0.03] border border-white/10 text-white/95 rounded-bl-none shadow-md";

                return (
                  <div key={(m as any).id || i} className={`flex ${align} items-end gap-2 w-full`}>
                    <div className={`max-w-[85%] rounded-3xl px-5 py-3.5 transition-all duration-300 hover:border-white/20 ${wrapBorder}`}>
                      {isUser ? (
                        Array.isArray(m.content) ? (
                          <div className="space-y-2">
                            {m.content.map((p, idx) => {
                              if (p.type === 'text') {
                                return (
                                  <p key={idx} className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed break-words">
                                    {cleanUserMessageDisplay(p.text)}
                                  </p>
                                );
                              }
                              if (p.type === 'image_url' && p.image_url?.url) {
                                const url = p.image_url.url;
                                const isPdfUrl = url.startsWith('data:application/pdf') || url.includes('.pdf');
                                if (isPdfUrl) {
                                  return (
                                    <div key={idx} className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-100 mt-1 shadow-sm">
                                      <div className="w-8 h-8 rounded-xl bg-red-500/25 flex items-center justify-center text-red-300 shrink-0">
                                        <FileText size={18} />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-[12px] font-semibold text-white break-keep break-words">PDF 문서 첨부</span>
                                        <span className="text-[10px] text-red-300/80">AI 멀티모달 문서 분석</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <img 
                                    key={idx} 
                                    src={p.image_url.url} 
                                    alt="첨부 이미지" 
                                    loading="lazy"
                                    className="max-w-full rounded-2xl border border-white/10 max-h-48 object-cover mt-1 min-h-[80px]" 
                                    referrerPolicy="no-referrer"
                                  />
                                );
                              }
                              return null;
                            })}
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap font-sans text-[13.5px] leading-relaxed break-words">{cleanUserMessageDisplay(m.content as string)}</p>
                        )
                      ) : (
                        <div className="font-sans text-[13.5px] leading-relaxed break-words markdown-body select-text text-left">
                          <Streamdown>{m.content as string}</Streamdown>
                        </div>
                      )}
                    </div>
                    {!isUser && (
                      <div className="flex items-center gap-1 shrink-0 mb-0.5 opacity-70 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(typeof m.content === 'string' ? m.content : '', i)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 transition-all active:scale-90 cursor-pointer"
                          title={copiedIndex === i ? "복사 완료!" : "답변 복사하기"}
                        >
                          {copiedIndex === i ? (
                            <Check size={13} className="text-emerald-400" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                        <TTSButton text={typeof m.content === 'string' ? m.content : ''} voice="Kore" className="shrink-0" />
                      </div>
                    )}
                  </div>
                );
              })}

              {currentGenerating && (
                <div className="flex justify-start items-center gap-2.5">
                  <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-200/80 text-[11px] px-4 py-2.5 rounded-3xl rounded-bl-none flex items-center gap-2 shadow-sm">
                    <span className="text-xs select-none animate-bounce">🍀</span>
                    <div className="flex gap-1 items-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-300/80 tracking-wider">루시가 생각하고 있어...</span>
                  </div>
                </div>
              )}
              <div id="unified-chat-bottom-anchor" ref={chatEndRef} className="h-6 w-full shrink-0 pointer-events-none" />
            </div>

            {/* Floating scroll to bottom button */}
            <AnimatePresence>
              {showScrollBottomBtn && (
                <motion.button
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleScrollToBottom}
                  aria-label="최근 대화로 스크롤 이동"
                  className="absolute bottom-32 right-6 z-30 px-3.5 py-1.5 rounded-full bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-semibold shadow-[0_8px_20px_rgba(37,99,235,0.4)] border border-blue-400/40 backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 group"
                >
                  <span>최근 대화</span>
                  <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Quick recommendations action prompt buttons */}
            {displayPrompts.length > 0 && !currentGenerating && (
              <div 
                id="unified-chat-suggestions-wrapper"
                className="relative w-full bg-[#08090d]/90 border-t border-white/[0.08] z-10 shrink-0 group select-none"
              >
                {/* Left scroll arrow button for PC */}
                {showLeftArrow && (
                  <button
                    type="button"
                    onClick={handleScrollLeft}
                    aria-label="이전 예시 보기"
                    className="absolute left-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-neutral-900/95 hover:bg-neutral-800 border border-white/20 hover:border-blue-400/60 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md active:scale-90"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}

                {/* Left gradient fade indicator */}
                {showLeftArrow && (
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#08090d] to-transparent pointer-events-none z-10" />
                )}

                {/* Scrollable Track */}
                <div 
                  ref={suggestionsRef}
                  id="unified-chat-suggestions-bar"
                  onWheel={(e) => {
                    if (e.currentTarget) {
                      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
                      e.currentTarget.scrollLeft += delta * 1.5;
                      updateScrollButtons();
                    }
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                  className="w-full px-4 py-3 overflow-x-auto scroll-smooth touch-pan-x flex items-center gap-2 cursor-grab active:cursor-grabbing select-none [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.25)_rgba(0,0,0,0.3)] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-black/30 [&::-webkit-scrollbar-thumb]:bg-white/25 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/40"
                >
                  <div className="flex items-center gap-2 pr-10 pl-1 w-max">
                    {displayPrompts.map((p, idx) => (
                      <button
                        key={idx}
                        id={`chat-prompt-example-${idx}`}
                        type="button"
                        onClick={() => {
                          if (hasMovedRef.current) return;
                          handleSend(p);
                        }}
                        className="px-3.5 py-2 rounded-full border border-white/20 bg-white/[0.06] hover:bg-white/[0.18] hover:border-blue-400/70 text-[12px] font-medium text-white/90 hover:text-white transition-all text-left whitespace-nowrap shrink-0 cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5 backdrop-blur-md"
                        title={p}
                      >
                        <Sparkles size={12} className="text-blue-400 shrink-0 opacity-90" />
                        <span>{p}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right gradient fade indicator */}
                {showRightArrow && (
                  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#08090d] to-transparent pointer-events-none z-10" />
                )}

                {/* Right scroll arrow button for PC */}
                {showRightArrow && (
                  <button
                    type="button"
                    onClick={handleScrollRight}
                    aria-label="다음 예시 보기"
                    className="absolute right-1 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-neutral-900/95 hover:bg-neutral-800 border border-white/20 hover:border-blue-400/60 text-white flex items-center justify-center shadow-2xl transition-all cursor-pointer backdrop-blur-md active:scale-90"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            )}

            {/* Bottom input section */}
            <div className="px-4 pt-4 pb-safe-4 border-t border-white/10 shrink-0 bg-[#06070a] z-50 flex flex-col gap-2 relative">
              {attachedFile && (
                <div className="relative self-start mt-1 mb-1 bg-white/[0.04] border border-white/15 p-2 rounded-2xl flex items-center gap-3 pr-8 backdrop-blur-md shadow-lg">
                  {attachedFile.isPdf || attachedFile.type === "application/pdf" ? (
                    <div className="w-11 h-11 rounded-xl border border-red-500/30 bg-red-500/15 flex flex-col items-center justify-center p-1 shrink-0 text-red-400">
                      <FileText size={20} />
                      <span className="text-[7.5px] font-bold tracking-tighter mt-0.5">PDF</span>
                    </div>
                  ) : attachedFile.dataUrl ? (
                    <img src={attachedFile.dataUrl} alt="Preview" className="w-11 h-11 object-cover rounded-xl border border-white/15 text-xs shrink-0" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl border border-blue-500/30 bg-blue-500/15 flex flex-col items-center justify-center p-1 shrink-0 text-blue-400">
                      <FileCode size={20} />
                      <span className="text-[7.5px] font-bold tracking-tighter mt-0.5 truncate uppercase">
                        {attachedFile.name.split('.').pop() || 'TXT'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col text-left max-w-[200px] justify-center overflow-hidden">
                    <span className="text-[12px] font-semibold text-white/90 break-all">{attachedFile.name}</span>
                    <span className="text-[9px] text-white/50 tracking-wide font-medium flex items-center gap-1.5 mt-0.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                      {attachedFile.isPdf ? "PDF 문서 (AI 분석 준비)" : attachedFile.dataUrl ? "이미지 파일" : "텍스트/문서 파일"}
                      {attachedFile.size ? ` · ${(attachedFile.size / 1024).toFixed(0)}KB` : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => setAttachedFile(null)}
                    type="button"
                    className="absolute -top-1.5 -right-1.5 p-1 rounded-full text-white bg-red-500/90 hover:bg-red-500 transition shadow-md hover:scale-110 active:scale-95"
                    title="첨부 취소"
                  >
                    <X size={11} />
                  </button>
                </div>
              )}

              <div className="flex gap-2.5 relative items-center">
                <input 
                  type="file" 
                  accept="image/*,application/pdf,.pdf,text/plain,.txt,.md,.json,.csv,.log" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={currentGenerating}
                  className="p-3 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white/60 hover:text-white rounded-2xl transition-all disabled:opacity-30"
                  title="PDF/이미지/문서 첨부"
                >
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={config.placeholder}
                  disabled={currentGenerating}
                  className="flex-1 h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-4.5 pr-14 text-white/90 placeholder-white/20 text-[16px] md:text-sm font-medium focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-all disabled:opacity-40"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={currentGenerating || (!input.trim() && !attachedFile)}
                  className="absolute right-2.5 p-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 active:scale-95 text-white transition-all disabled:opacity-30 disabled:bg-white/10 disabled:text-white/40 shadow-lg shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {/* 🗑️ 대화 초기화 확인 모달 (UnifiedChat) */}
            <AnimatePresence>
              {isResetConfirmOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md rounded-3xl">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-[#181a20] border border-white/10 rounded-2xl p-5 w-full max-w-sm space-y-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                        <Trash2 size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">대화 초기화</h4>
                        <p className="text-[11px] text-white/50">새로운 대화창으로 시작합니다</p>
                      </div>
                    </div>

                    <p className="text-xs text-white/70 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/5">
                      지금까지의 대화는 <span className="text-indigo-300 font-semibold">영구 기억(Soul Memory)</span>에 안전하게 보존되며, 깨끗한 새 대화창으로 초기화됩니다. 계속할까요?
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsResetConfirmOpen(false)}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          stopTTS();
                          clearPersonaMessages(activePersona || 'lucy');
                          setIsResetConfirmOpen(false);
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>초기화</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
