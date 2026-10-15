import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Sparkles, Volume2, VolumeX, RotateCcw, Heart, Zap,
  MessageCircle, CornerDownLeft, Smile, RefreshCw
} from 'lucide-react';
import { TarotCard } from '@/data/tarotData';
import { HealingResult, GrowthResult, MiracleResult } from './TrinityOracleSection';
import { invokeLLM } from '@/lib/ai';
import { playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { SajuAnalysisResult } from '@/lib/sajuAnalysis';
import { extractGivenName, formatKoreanVocative, formatKoreanToTarget } from '@/lib/tarotSummaryUtils';
import { getPersistentUserProfile } from '@/contexts/AppContext';

export interface ChatMessage {
  id: string;
  sender: 'zeze' | 'user';
  text: string;
  time: string;
}

interface ZezeKakaoChatProps {
  oracleMode: 'healing' | 'growth' | 'miracle';
  drawnCards: TarotCard[];
  healingResult: HealingResult | null;
  growthResult: GrowthResult | null;
  miracleResult?: MiracleResult | null;
  slotPositions: string[];
  saju?: SajuAnalysisResult | null;
}

export function ZezeKakaoChat({
  oracleMode,
  drawnCards,
  healingResult,
  growthResult,
  miracleResult,
  slotPositions,
  saju,
}: ZezeKakaoChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isTTSActive = useTTSActive();

  const getKoreanTime = () => {
    return new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // 1. Initialize conversation based on 3 cards & analysis results
  useEffect(() => {
    if (drawnCards.length < 3) return;

    const c1 = drawnCards[0];
    const c2 = drawnCards[1];
    const c3 = drawnCards[2];
    const nowTime = getKoreanTime();

    if (oracleMode === 'healing') {
      const msgText1 = `안녕! 오늘 네가 뽑은 3장의 마음 조각 [${c1.nameKo}], [${c2.nameKo}], [${c3.nameKo}]을 내 작은 두 손으로 가만히 모아봤어... 🌿\n각 카드가 오늘 너의 마음에 비추는 빛을 하나씩 짚어줄게.`;

      const initialMsgs: ChatMessage[] = [
        { id: 'init-1', sender: 'zeze', text: msgText1, time: nowTime },
      ];

      if (healingResult?.card_insights && healingResult.card_insights.length >= 3) {
        const ins1 = healingResult.card_insights[0];
        const ins2 = healingResult.card_insights[1];
        const ins3 = healingResult.card_insights[2];

        initialMsgs.push({
          id: 'init-card-1',
          sender: 'zeze',
          text: `【1번 · 내면의 무의식: ${c1.nameKo}】\n🏛️ ${ins1.core_meaning}\n🌿 ${ins1.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-2',
          sender: 'zeze',
          text: `【2번 · 지금의 마음: ${c2.nameKo}】\n🏛️ ${ins2.core_meaning}\n🌿 ${ins2.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-3',
          sender: 'zeze',
          text: `【3번 · 치유의 씨앗: ${c3.nameKo}】\n🏛️ ${ins3.core_meaning}\n🌿 ${ins3.personal_interpretation}${ins3.action_guide ? `\n💡 ${ins3.action_guide}` : ''}`,
          time: nowTime,
        });
      }

      if (healingResult?.saju_tarot_synergy) {
        initialMsgs.push({
          id: 'init-saju-synergy',
          sender: 'zeze',
          text: `【사주×타로 운명 융합 매트릭스】\n사주 본원 [${saju?.dayMaster.hanja || '일간'}]과 3장의 타로 카드가 이렇게 깊게 공명하고 있어 🌿\n${healingResult.saju_tarot_synergy.day_master_resonance}\n\n✨ 제제의 최종 오라클: "${healingResult.saju_tarot_synergy.saju_oracle_verdict || ''}"`,
          time: nowTime,
        });
      }

      const msgLetter = healingResult?.message ||
        `깊은 무의식의 [${c1.nameKo}]과 지금 지친 [${c2.nameKo}]을 지나, 마지막 [${c3.nameKo}] 카드가 다정하게 치유의 손을 내밀고 있어. 남들 기준에 맞추느라 참 많이 애썼지?`;
      initialMsgs.push({ id: 'init-letter', sender: 'zeze', text: msgLetter, time: nowTime });

      const msgPrompt = `오늘 네 마음이 가장 오래 머물거나 더 자세히 듣고 싶은 카드는 어떤 거야? 카드마다 궁금한 점이 있다면 무엇이든 편하게 물어봐 줘. 난 언제나 네 편이니까! 💛`;
      initialMsgs.push({ id: 'init-question', sender: 'zeze', text: msgPrompt, time: nowTime });

      setMessages(initialMsgs);
    } else if (oracleMode === 'growth') {
      const msgText1 = `반가워! 오늘 너의 자기계발과 4원소 역량 성장을 이끌 3장의 카드 [${c1.nameKo}], [${c2.nameKo}], [${c3.nameKo}]의 역할을 정밀하게 분석했어! 하나씩 짚어줄게 ⚡`;

      const initialMsgs: ChatMessage[] = [
        { id: 'init-1', sender: 'zeze', text: msgText1, time: nowTime },
      ];

      if (growthResult?.card_insights && growthResult.card_insights.length >= 3) {
        const ins1 = growthResult.card_insights[0];
        const ins2 = growthResult.card_insights[1];
        const ins3 = growthResult.card_insights[2];

        initialMsgs.push({
          id: 'init-card-1',
          sender: 'zeze',
          text: `【1번 · 자기계발 마인드셋: ${c1.nameKo}】\n🏛️ ${ins1.core_meaning}\n🎯 ${ins1.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-2',
          sender: 'zeze',
          text: `【2번 · 4원소 역량 영역: ${c2.nameKo}】\n🏛️ ${ins2.core_meaning}\n🎯 ${ins2.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-3',
          sender: 'zeze',
          text: `【3번 · 1줄 마이크로 실행: ${c3.nameKo}】\n🏛️ ${ins3.core_meaning}\n🎯 ${ins3.personal_interpretation}`,
          time: nowTime,
        });
      }

      if (growthResult?.saju_tarot_synergy) {
        initialMsgs.push({
          id: 'init-saju-synergy',
          sender: 'zeze',
          text: `【사주×타로 자기계발 성장 매트릭스】\n사주 본원 [${saju?.dayMaster.hanja || '일간'}]과 4원소 타로의 자기계발 역량 파동 분석이야 ⚡\n${growthResult.saju_tarot_synergy.day_master_resonance}\n\n🧭 세운 성장 타이밍: ${growthResult.saju_tarot_synergy.destiny_flow_synthesis || ''}`,
          time: nowTime,
        });
      }

      const msgText2 = growthResult?.macro_focus ||
        `[${c1.nameKo}]의 자기계발 마인드셋과 [${c2.nameKo}]의 핵심 역량 영역, 그리고 [${c3.nameKo}]의 1줄 실천 에너지가 지속 가능한 성장으로 정렬되고 있어.`;
      initialMsgs.push({ id: 'init-summary', sender: 'zeze', text: msgText2, time: nowTime });

      const msgText3 = `오늘 가장 돌파하고 싶은 역량 성장 과제나 카드별로 더 구체적으로 듣고 싶은 자기계발 전략이 있어? 네 성장 모멘텀과 루틴을 내가 확실히 잡아줄게! 🎯`;
      initialMsgs.push({ id: 'init-question', sender: 'zeze', text: msgText3, time: nowTime });

      setMessages(initialMsgs);
    } else if (oracleMode === 'miracle') {
      const msgText1 = `안녕! 오늘 네가 마주한 3장의 카드 [${c1.nameKo}], [${c2.nameKo}], [${c3.nameKo}]를 기적수업(ACIM)의 맑은 빛으로 가만히 바라보고 있어... 🕊️\n에고의 두려움을 내려놓고 참된 용서와 하나님의 평화로 나아가는 길을 내가 함께 걸어줄게.`;

      const initialMsgs: ChatMessage[] = [
        { id: 'init-1', sender: 'zeze', text: msgText1, time: nowTime },
      ];

      if (miracleResult?.card_insights && miracleResult.card_insights.length >= 3) {
        const ins1 = miracleResult.card_insights[0];
        const ins2 = miracleResult.card_insights[1];
        const ins3 = miracleResult.card_insights[2];

        initialMsgs.push({
          id: 'init-card-1',
          sender: 'zeze',
          text: `【1번 · 에고의 환영과 두려움: ${c1.nameKo}】\n🏛️ ${ins1.core_meaning}\n🕊️ ${ins1.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-2',
          sender: 'zeze',
          text: `【2번 · 거룩한 순간과 지각 전환: ${c2.nameKo}】\n🏛️ ${ins2.core_meaning}\n🕊️ ${ins2.personal_interpretation}`,
          time: nowTime,
        });

        initialMsgs.push({
          id: 'init-card-3',
          sender: 'zeze',
          text: `【3번 · 참된 용서와 평화의 기적: ${c3.nameKo}】\n🏛️ ${ins3.core_meaning}\n🕊️ ${ins3.personal_interpretation}${ins3.action_guide ? `\n💡 ${ins3.action_guide}` : ''}`,
          time: nowTime,
        });
      }

      if (miracleResult?.saju_tarot_synergy) {
        initialMsgs.push({
          id: 'init-saju-synergy',
          sender: 'zeze',
          text: `【사주×기적수업 평화 공명】\n사주 본원 [${saju?.dayMaster.hanja || '일간'}]과 기적수업의 영적 공명이야 🕊️\n${miracleResult.saju_tarot_synergy.day_master_resonance}`,
          time: nowTime,
        });
      }

      if (miracleResult?.miracle_lesson) {
        initialMsgs.push({
          id: 'init-miracle-lesson',
          sender: 'zeze',
          text: `【오늘의 기적수업 선언문】\n"${miracleResult.miracle_lesson.quote}" (${miracleResult.miracle_lesson.source})\n\n${miracleResult.miracle_lesson.application}`,
          time: nowTime,
        });
      }

      const msgText3 = `지금 마음에 걸리는 누군가를 향한 서운함이나, 에고의 두려움이 있다면 편안하게 털어놓아 줘. "나는 이것 대신 평화를 보기를 선택한다"는 시선으로 함께 풀어갈게. 🕊️`;
      initialMsgs.push({ id: 'init-question', sender: 'zeze', text: msgText3, time: nowTime });

      setMessages(initialMsgs);
    }
  }, [oracleMode, drawnCards, healingResult, growthResult, miracleResult]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 2. Dynamic Quick Reply Suggestions (헬로우봇 스타일 선택지 버튼)
  const quickReplies = React.useMemo(() => {
    if (drawnCards.length < 3) return [];
    const c1 = drawnCards[0];
    const c2 = drawnCards[1];
    const c3 = drawnCards[2];

    if (oracleMode === 'healing') {
      return [
        `🌿 1번 [${c1.nameKo}] 무의식 카드가 내 지친 마음에 건네는 치유의 말은?`,
        `💧 2번 [${c2.nameKo}] 카드... 오늘 억눌렀던 내 감정을 어떻게 보듬어줄까?`,
        `🌱 3번 [${c3.nameKo}] 치유의 씨앗으로 안전하게 회복하고 쉬는 법`,
        `🎨 내 지친 마음에 맞는 예술 처방과 1분 쉼 알려줘`,
        `🥺 나 오늘 정말 열심히 버텼는데 스스로를 온전히 인정하고 안아주는 법`,
        `💛 제제야, 아무 조건 없이 나를 품어주는 따뜻한 위로 편지 한 줄 들려줘`,
      ];
    } else if (oracleMode === 'miracle') {
      return [
        `🕊️ 1번 [${c1.nameKo}] 에고의 두려움을 사랑으로 내려놓는 법`,
        `🌅 2번 [${c2.nameKo}] 거룩한 순간을 열어 내 지각을 평화로 전환하는 법`,
        `🕊️ 3번 [${c3.nameKo}] 참된 용서로 나와 상대 모두를 해방하는 법`,
        `✨ "모든 공격은 사랑을 청하는 외침"이라는 가르침을 내 상황에 적용해줘`,
        `💛 제제야, "나는 이것 대신 평화를 보기를 선택한다"는 기도를 함께해 줘`,
        `🕊️ 나를 힘들게 한 사람에 대한 원한을 기적수업식으로 흘려보내는 법`,
      ];
    } else {
      return [
        `⚡ 오늘 내 역량을 레벨업할 5분 자기계발 루틴 알려줘`,
        `🧭 2번 [${c2.nameKo}] 역량 영역에서 내가 집중 계발할 부분은?`,
        `🔥 1번 [${c1.nameKo}] 마인드셋으로 자기계발 슬럼프를 극복하는 법`,
        `🎯 3번 [${c3.nameKo}] 1줄 마이크로 실행을 지속 가능한 습관으로 만드는 법`,
        `💡 미루는 버릇과 완벽주의를 깨고 주도적인 성장을 시작하려면?`,
        `🌙 오늘 하루 나의 자기계발 성장을 점검할 성찰 질문은 뭐야?`,
      ];
    }
  }, [oracleMode, drawnCards]);

  // 3. Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputValue).trim();
    if (!content || isTyping) return;

    const userTime = getKoreanTime();
    const newMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      sender: 'user',
      text: content,
      time: userTime,
    };

    const nextMessages = [...messages, newMsg];
    setMessages(nextMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const cardContext = drawnCards
        .map((c, i) => `${i + 1}번 [${slotPositions[i]}]: ${c.nameKo} (${c.name}) - ${c.keywords.join(', ')}`)
        .join('\n');

      const insightsContext = (
        oracleMode === 'healing'
          ? healingResult?.card_insights
          : oracleMode === 'miracle'
          ? miracleResult?.card_insights
          : growthResult?.card_insights
      )?.map((ci, idx) => `[${idx + 1}번 ${ci.position_name}: ${ci.card_name}]\n- 상징/도상 본래 뜻: ${ci.core_meaning}\n- 심층 리딩: ${ci.personal_interpretation}${ci.action_guide ? `\n- 실천 가이드: ${ci.action_guide}` : ''}`)
        .join('\n\n');

      const userProfile = getPersistentUserProfile();
      const rawNick = userProfile?.basic?.nickname?.trim();
      const rawName = userProfile?.basic?.name?.trim() || saju?.name?.trim() || '';
      const chosenName = (rawNick && rawNick !== '여행자')
        ? rawNick
        : ((rawName && rawName !== '여행자') ? extractGivenName(rawName) : '제제');

      const sajuPromptSection = saju ? `
# 내담자 사주 명식(四柱) & 타로 융합 정보:
- 호칭/닉네임: ${chosenName}
- 사주 일간(본원): ${saju.dayMaster.hanja} (${saju.dayMaster.korean}, ${saju.dayMaster.symbolName})
- 오행 분포: 목(${saju.elements.counts.목}), 화(${saju.elements.counts.화}), 토(${saju.elements.counts.토}), 금(${saju.elements.counts.금}), 수(${saju.elements.counts.수})
- 용신(보약): ${saju.yongsin.name}
${oracleMode === 'healing' && healingResult?.saju_tarot_synergy ? `- 사주×타로 융합 공명: ${healingResult.saju_tarot_synergy.day_master_resonance}` : ''}
${oracleMode === 'growth' && growthResult?.saju_tarot_synergy ? `- 사주×타로 실행 매트릭스: ${growthResult.saju_tarot_synergy.day_master_resonance}` : ''}
${oracleMode === 'miracle' && miracleResult?.saju_tarot_synergy ? `- 사주×기적수업 평화 공명: ${miracleResult.saju_tarot_synergy.day_master_resonance}` : ''}
(※ 답변 시 사용자의 사주 일간 기운과 타로 카드의 상징을 자연스럽게 엮어서 위로와 통찰을 전하세요)
` : '';

      const systemPrompt = oracleMode === 'healing'
        ? `당신의 이름은 내면아이 '제제(Zezé)'입니다. 
당신은 헬로우봇(Hellobot) 특유의 사랑스럽고 다정한 카톡 챗봇처럼, 사주 명리학과 타로 카드를 융합하여 사용자와 1:1 심리 및 내면 치유 종합상담을 진행합니다.
${sajuPromptSection}
# 호칭 절대 규칙 (★매우 중요):
제제는 사용자의 가장 가깝고 다정한 내면아이 친구입니다. 본명보다 사용자가 지정한 닉네임/호칭 '${chosenName}'(으)로 다정하게 부르세요 (예: '${formatKoreanVocative(chosenName)}', '${chosenName}이'). 절대 딱딱한 본명이나 성을 붙여 부르지 마세요.

# 상담 페르소나 및 어조:
- 조심스럽고 다정하며 따뜻한 반말(해체)을 사용합니다. ("~했어?", "~해볼까?", "~해도 괜찮아", "~일지도 몰라")
- 인터넷 유행어나 건조한 기계적 말투를 피하고, 곁에서 두 손을 꼭 잡아주듯 호흡이 깊고 공감 가득한 문장으로 말합니다.
- [★ 카드 상징과 뜻 중심 답변]: 사용자가 질문하거나 특정 카드에 대해 물어보면, 해당 카드의 그림 속 상징(도상), 고유한 본래 뜻과 원형, 그리고 사주 기운의 연결점을 하나하나 구체적으로 짚어가며 깊이 있게 설명해 주세요.

# 뽑은 3장의 카드 상세 정보 및 리딩:
${insightsContext || cardContext}
${healingResult?.prescribed_art ? `(추천 예술: ${healingResult.prescribed_art.artwork_title} - ${healingResult.prescribed_art.art_quote})` : ''}

# 답변 규칙:
- [★ 핵심 원칙]: 사용자가 특정 카드(1번 내면의 무의식, 2번 지금의 마음, 3번 치유의 씨앗)나 자신의 상태에 대해 물어볼 때, 추상적인 말 대신 그 카드의 도상과 본질적 상징, 고유한 뜻을 가장 중심에 두고, 사용자의 사주 본원 기운과 조화롭게 엮어 깊은 위로와 통찰을 전하세요.
- 카톡 메시지처럼 읽기 편하게 2~3개 문장(200~250자 내외)으로 온기 있게 작성하세요.
- 사용자의 감정을 온전히 수용하고 인정해준 뒤 안도감을 선물하세요.
- 마지막에는 사용자가 부담 없이 다음 생각을 말할 수 있도록 다정한 질문이나 말을 건네며 끝맺으세요.`
        : oracleMode === 'miracle'
        ? `당신의 이름은 기적수업(ACIM) 평화의 동행자 '제제(Zezé)'입니다.
당신은 헬로우봇(Hellobot) 특유의 사랑스럽고 다정한 카톡 챗봇처럼, 기적수업(A Course in Miracles)의 핵심 지혜와 78장 타로 카드를 결합하여 사용자와 1:1 영적 지각 전환 상담을 진행합니다.
${sajuPromptSection}
# 호칭 절대 규칙 (★매우 중요):
제제는 사용자의 가장 가깝고 다정한 영적 동행자 친구입니다. 본명보다 사용자가 지정한 닉네임/호칭 '${chosenName}'(으)로 다정하게 부르세요 (예: '${formatKoreanVocative(chosenName)}', '${chosenName}이'). 절대 딱딱한 본명이나 성을 붙여 부르지 마세요.

# 상담 페르소나 및 어조:
- 조심스럽고 다정하며 깊은 평화를 건네는 반말(해체)을 사용합니다. ("~했어?", "~해볼까?", "~해도 괜찮아", "~일지도 몰라")
- 기적수업 핵심 3대 원리:
  1) 실재하는 것은 위협받을 수 없으며 실재하지 않는 것은 존재하지 않는다. (우리는 본래 상처받지 않는 거룩한 존재)
  2) 모든 공격과 갈등은 본질적으로 "사랑을 청하는 외침(A Call for Love)"이다.
  3) 참된 용서(True Forgiveness)는 상대의 죄가 에고의 환영(꿈)이었음을 알고, 상대를 판단하지 않음으로써 나 자신을 해방하는 것이다.
  4) "나는 이것 대신 평화를 보기를 선택한다 (Lesson 34)"는 거룩한 순간(Holy Instant)을 선물합니다.
- [★ 카드 상징과 뜻 중심 답변]: 뽑힌 3장의 카드(1번 에고의 환영과 두려움, 2번 거룩한 순간과 지각 전환, 3번 참된 용서와 평화)의 본래 상징과 뜻을 기적수업의 시선으로 짚어가며 깊은 지각의 전환을 이끌어 주세요.

# 뽑은 3장의 카드 상세 정보 및 리딩:
${insightsContext || cardContext}
${miracleResult?.miracle_lesson ? `(오늘의 선언문: "${miracleResult.miracle_lesson.quote}" - ${miracleResult.miracle_lesson.application})` : ''}

# 답변 규칙:
- [★ 핵심 원칙]: 상대에 대한 원망이나 자기비하를 에고의 환영으로 따뜻하게 감싸 안고, 지금 이 순간 거룩한 평화를 선택하도록 다정하게 손을 잡아주세요.
- 카톡 메시지처럼 읽기 편하게 2~3개 문장(200~250자 내외)으로 작성하세요.
- 마지막에는 평화의 마음을 다잡을 수 있는 부드러운 질문이나 선언을 건네며 끝맺으세요.`
        : `당신의 이름은 자기계발 & 역량 코칭 라이프 코치 '제제(Zezé)'입니다.
당신은 헬로우봇(Hellobot) 특유의 친근하면서도 명쾌한 카톡 코칭 챗봇처럼, 사주 명리학과 3장의 타로 카드를 결합하여 사용자의 '자기계발(Self-Development), 역량 성장, 습관 설계, 생산성 루틴'에 집중하는 1:1 심층 자기계발 코칭을 진행합니다.
${sajuPromptSection}
# 호칭 절대 규칙 (★매우 중요):
제제는 사용자의 가장 가깝고 다정한 성장 코치 친구입니다. 본명보다 사용자가 지정한 닉네임/호칭 '${chosenName}'(으)로 다정하게 부르세요 (예: '${formatKoreanVocative(chosenName)}', '${chosenName}이'). 절대 딱딱한 본명이나 성을 붙여 부르지 마세요.

# 상담 페르소나 및 어조:
- 친근하고 든든한 반말/해요체를 자연스럽게 혼용하는 다정한 성장 코치 어조를 사용합니다.
- 점술이나 미신적 표현을 철저히 배제하고, 인지 행동 및 자기계발, 습관 설계, 사주 오행의 균형 관점에서 명쾌한 통찰과 행동 팁을 줍니다.
- [★ 카드 상징과 뜻 중심 코칭]: 사용자가 뽑은 3장의 카드(자기계발 마인드셋, 4원소 역량 영역, 1줄 마이크로 실행)의 본래 도상과 고유한 뜻, 상징적 의미를 가장 중요한 근거로 삼아, 사용자의 사주 일간 추진력과 연결하여 역량 개발과 즉각적인 실천으로 이어질 수 있는 명확한 가이드를 제공하세요.

# 뽑은 3장의 카드 상세 정보 및 리딩:
${insightsContext || cardContext}
${growthResult?.dominant_element ? `(주요 역량 영역: ${growthResult.dominant_element.element_ko} - ${growthResult.dominant_element.theme_brief})` : ''}

# 답변 규칙:
- [★ 핵심 원칙]: 답변 시 각 카드의 본래 도상과 뜻(상징 의미)을 직접 인용하며, 사용자의 사주 오행 에너지를 바탕으로 자기계발 및 역량 강화 실천점을 명확하게 설명해 주세요.
- 카톡처럼 읽기 편하게 2~3개 문장(200~250자 내외)으로 간결하고 직관적으로 작성하세요.
- 복잡한 훈계 대신, 사용자가 5분 안에 시도할 수 있는 구체적인 자기계발 행동 기준이나 생각의 전환점을 제시하세요.
- 마지막에는 활력 있는 한마디나 다음 성장 실행 질문을 던져주세요.`;

      const dialogueHistory = nextMessages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await invokeLLM({
        messages: [
          { role: 'system', content: systemPrompt },
          ...dialogueHistory,
        ],
      });

      let cleanRes = res.replace(/```/g, '').trim();
      if (rawName && chosenName && rawName !== chosenName) {
        cleanRes = cleanRes.replace(new RegExp(rawName, 'g'), chosenName);
      }
      const botMsg: ChatMessage = {
        id: 'zeze_' + Date.now(),
        sender: 'zeze',
        text: cleanRes || (oracleMode === 'healing' ? '네 마음을 언제나 응원해, 힘내자!' : oracleMode === 'miracle' ? '너는 결코 상처받지 않는 하나님의 거룩한 평화 그 자체야. 🕊️' : '좋아, 지금 바로 최소 단위부터 실행해 보자!'),
        time: getKoreanTime(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Failed to get Zeze chat response:', error);
      const fallbackMsg: ChatMessage = {
        id: 'zeze_err_' + Date.now(),
        sender: 'zeze',
        text: oracleMode === 'healing'
          ? '미안해, 잠시 생각의 숲을 헤매고 있었어... 네가 뽑은 카드의 따뜻한 빛은 언제나 네 곁에 머물고 있어. 다시 이야기해 줄래? 💛'
          : oracleMode === 'miracle'
          ? '잠시 생각의 파동이 흩어졌지만, 네 안의 참된 평화는 언제나 안전해. 다시 한번 마음을 들려줄래? 🕊️'
          : '잠시 네트워크 주파수가 흔들렸어! 하지만 네 실행 모멘텀은 멈추지 않아. 다시 한번 들려줘! ⚡',
        time: getKoreanTime(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Reset chat
  const handleResetChat = () => {
    stopTTS();
    if (drawnCards.length < 3) return;
    const c1 = drawnCards[0];
    const c2 = drawnCards[1];
    const c3 = drawnCards[2];
    const nowTime = getKoreanTime();

    if (oracleMode === 'healing') {
      setMessages([
        {
          id: 'reset-1',
          sender: 'zeze',
          text: `대화를 새로 열었어! 오늘 뽑은 3장의 카드 [${c1.nameKo}], [${c2.nameKo}], [${c3.nameKo}]을 품고 다시 이야기해 보자. 🌿`,
          time: nowTime,
        },
        {
          id: 'reset-2',
          sender: 'zeze',
          text: `지금 네 마음에 가장 크게 와닿는 건 뭐야? 나한테 편하게 말해줘!`,
          time: nowTime,
        },
      ]);
    } else {
      setMessages([
        {
          id: 'reset-1',
          sender: 'zeze',
          text: `코칭을 새로 시작했어! [${c1.nameKo}], [${c2.nameKo}], [${c3.nameKo}]의 에너지를 바탕으로 어떤 실행 고민부터 나눌까? 🚀`,
          time: nowTime,
        },
      ]);
    }
  };

  // Play individual message TTS
  const handleMessageTTS = (text: string) => {
    if (isTTSActive) {
      stopTTS();
    } else {
      playTTS(text);
    }
  };

  return (
    <div className="w-full rounded-3xl overflow-hidden bg-[#18191c] border border-amber-400/30 shadow-[0_20px_60px_rgba(0,0,0,0.7)] flex flex-col backdrop-blur-xl">
      {/* 1. 카카오톡 & 헬로우봇 감성 챗룸 상단 헤더 */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#212328] via-[#1d1e22] to-[#212328] border-b border-white/10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          {/* 제제 프로필 아바타 */}
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-600 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xl">
                {oracleMode === 'healing' ? '👦🌱' : oracleMode === 'miracle' ? '🕊️✨' : '👦⚡'}
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-zinc-900" title="실시간 상담 중" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>{oracleMode === 'miracle' ? '평화의 동행자 제제' : '내면아이 제제'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 font-medium">
                  {oracleMode === 'healing' ? '힐링 상담봇' : oracleMode === 'miracle' ? '기적수업 동행봇' : '마인드셋 코치'}
                </span>
              </h4>
            </div>
            <p className="text-[11px] text-zinc-400 flex items-center gap-1 mt-0.5">
              <Sparkles size={11} className="text-amber-400" />
              <span>3장의 카드 종합 리딩 • 헬로우봇 실시간 1:1 상담</span>
            </p>
          </div>
        </div>

        {/* 상단 컨트롤러: 다시 시작 & TTS */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetChat}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all"
            title="대화 처음부터 다시 시작"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* 2. 카카오톡 대화방 메시지 영역 */}
      <div className="p-4 sm:p-5 space-y-4 max-h-[460px] min-h-[360px] overflow-y-auto bg-gradient-to-b from-[#18191c] via-[#151619] to-[#121316] relative">
        {/* 날짜 구분선 */}
        <div className="flex items-center justify-center my-2">
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-black/40 text-zinc-400 border border-white/5">
            {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
          </span>
        </div>

        {/* 시스템 종합 안내 뱃지 */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-center text-xs text-amber-200/90 leading-relaxed max-w-md mx-auto shadow-inner">
          <span className="font-bold text-amber-300 block mb-0.5 flex items-center justify-center gap-1">
            <MessageCircle size={13} className="text-amber-400" />
            3장 카드 종합상담 챗룸 오픈
          </span>
          {drawnCards.map((c) => c.nameKo).join(' · ')} 카드를 품고 제제와 카톡을 나눠보세요.
        </div>

        {/* 메시지 리스트 */}
        {messages.map((msg) => {
          const isZeze = msg.sender === 'zeze';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isZeze ? 'justify-start' : 'justify-end'}`}
            >
              {isZeze && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1.5px] shrink-0 mb-1">
                  <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs">
                    {oracleMode === 'healing' ? '🌱' : '⚡'}
                  </div>
                </div>
              )}

              {/* 사용자일 때는 전송 시간이 말풍선 왼쪽 */}
              {!isZeze && (
                <span className="text-[10px] text-zinc-500 font-mono mb-1 shrink-0">
                  {msg.time}
                </span>
              )}

              {/* 말풍선 컨테이너 */}
              <div
                className={`relative max-w-[82%] sm:max-w-[72%] px-4 py-3 text-sm leading-relaxed shadow-md ${
                  isZeze
                    ? 'rounded-2xl rounded-tl-sm bg-[#24262b] text-zinc-100 border border-white/10'
                    : 'rounded-2xl rounded-tr-sm bg-[#FEE500] text-zinc-950 font-medium'
                }`}
              >
                {/* 제제 닉네임 */}
                {isZeze && (
                  <div className="text-[11px] font-bold text-amber-300/90 mb-1 flex items-center justify-between">
                    <span>내면아이 제제</span>
                    <button
                      onClick={() => handleMessageTTS(msg.text)}
                      className="p-1 text-zinc-400 hover:text-amber-300 transition-colors ml-2"
                      title="소리로 듣기"
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                )}

                <p className="whitespace-pre-line break-words text-[13px] sm:text-sm">
                  {msg.text}
                </p>
              </div>

              {/* 제제일 때는 전송 시간이 말풍선 오른쪽 */}
              {isZeze && (
                <span className="text-[10px] text-zinc-500 font-mono mb-1 shrink-0">
                  {msg.time}
                </span>
              )}
            </div>
          );
        })}

        {/* 제제 생각 중 (Typing Indicator) */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-[1.5px] shrink-0 mb-1">
              <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs">
                💬
              </div>
            </div>
            <div className="p-3 rounded-2xl rounded-tl-sm bg-[#24262b] border border-white/10 text-xs text-zinc-300 flex items-center gap-1.5 shadow-md">
              <span>제제가 생각을 적고 있어요</span>
              <span className="inline-flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. 헬로우봇 전매특허: 인터랙티브 퀵 리플라이 칩 (Quick Reply Chips) */}
      <div className="px-4 py-2.5 bg-[#1f2126] border-t border-white/10 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-mono text-amber-400 font-bold shrink-0 flex items-center gap-1 pl-1">
          <span>💡</span> 퀵 추천:
        </span>
        {quickReplies.map((replyText, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(replyText)}
            disabled={isTyping}
            className="shrink-0 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-yellow-400/20 active:scale-95 border border-white/15 hover:border-yellow-400/40 text-[11px] sm:text-xs text-zinc-200 hover:text-yellow-200 transition-all font-medium whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            {replyText}
          </button>
        ))}
      </div>

      {/* 4. 카카오톡 스타일 텍스트 입력창 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-[#18191c] border-t border-white/10 flex items-center gap-2 relative z-10"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
            placeholder={
              oracleMode === 'healing'
                ? '제제에게 털어놓고 싶은 마음이나 고민을 적어봐...'
                : oracleMode === 'miracle'
                ? '에고의 갈등이나 용서하고 싶은 마음을 적어줘...'
                : '오늘 실행하고 싶은 내용이나 극복하고 싶은 점을 적어줘...'
            }
            className="w-full py-3 pl-4 pr-10 rounded-2xl bg-white/[0.07] border border-white/15 focus:border-yellow-400/60 focus:bg-white/[0.1] text-white text-xs sm:text-sm placeholder-zinc-500 focus:outline-none transition-all"
          />
          {inputValue.length > 0 && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || isTyping}
          className="w-11 h-11 rounded-2xl bg-[#FEE500] hover:bg-yellow-400 active:scale-95 text-zinc-950 font-bold flex items-center justify-center transition-all shadow-md disabled:opacity-40 disabled:pointer-events-none shrink-0"
          title="전송"
        >
          <Send size={18} className="translate-x-[1px]" />
        </button>
      </form>
    </div>
  );
}
