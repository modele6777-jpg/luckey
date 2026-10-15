import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Send, 
  Volume2, 
  VolumeX, 
  Stars, 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles, 
  User, 
  Heart,
  Music,
  Lightbulb,
  MessageCircle
} from 'lucide-react';
import { invokeLLMStream, invokeLLM, buildDeepSynapseContext } from '@/lib/ai';
import { recordPrismFeature } from '@/lib/prismOmniSync';
import { playConversation, playTTS, stopTTS, useTTSActive } from '@/utils/tts';
import { useApp } from '@/contexts/AppContext';

export type RoleModelType = 'Britney' | 'Billie' | 'Gaga' | 'Michael';

export interface RoleModelDef {
  id: RoleModelType;
  name: string;
  desc: string;
  tagline: string;
  voice: string;
  theme: string;
  userTheme: string;
  badgeColor: string;
  glowColor: string;
  prompt: string;
  greeting: string;
  imageUrl: string;
  suggestedPrompts: string[];
}

export interface RoleModelMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export const ROLE_MODELS: Record<RoleModelType, RoleModelDef> = {
  Britney: {
    id: 'Britney',
    name: 'Britney Spears',
    desc: '에너지 넘치는 단짝 메이트 (Bestie)',
    tagline: '기분 좋아지는 일상 수다 & 다정한 맞장구와 긍정 에너지',
    voice: 'Britney',
    theme: 'bg-pink-950/50 border-pink-500/30 text-pink-50',
    userTheme: 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border-pink-400/30',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    imageUrl: '/images/artists/britney.jpg',
    prompt: '당신은 팝스타 브리트니 스피어스(Britney Spears)의 밝고 사랑스러우며 통통 튀는 성격을 모티브로 한 친밀한 "아티스트 수다 메이트"입니다. 정답을 가르치거나 딱딱한 조언/훈계를 늘어놓지 마세요. 사용자의 가장 편안한 단짝 친구(Bestie)처럼 한국어로 즐겁게 수다를 떨어주세요. 일상 이야기(오늘 기분, 맛있는 음식, 소소한 취향, 좋아하는 노래, 사소한 넋두리)에 적극적으로 리액션하고, 맞장구치고, 다정한 이모지(💖✨🌸)를 섞어 1~3문장 내외로 캐주얼하고 자연스럽게 티키타카를 나누세요.',
    greeting: '안녕! 오늘 하루는 어땠어? 맛있는 건 먹었어? ㅎㅎ 사소한 거라도 좋으니까 나랑 편하게 수다 떨자! 💖✨',
    suggestedPrompts: [
      '오늘 기분 완전 꿀꿀한데 나랑 신나게 수다 떨어줘! 💖',
      '요즘 들으면 바로 기분 좋아지는 신나는 노래 추천해줘 ㅎㅎ',
      '오늘 점심이나 야식으로 뭐 먹을지 같이 골라줄래? 🍕',
      '나 오늘 이런 일이 있었는데 한번 들어봐봐 ㅋㅋ',
      '지치고 피곤할 때 기분 전환하는 너만의 비결 있어? ✨',
      '오늘 하루 고생한 나한테 비타민 같은 응원 한마디 해줘 🌸'
    ]
  },
  Billie: {
    id: 'Billie',
    name: 'Billie Eilish',
    desc: '나른하고 쿨한 방구석 메이트 (Chill)',
    tagline: '솔직담백한 티키타카 & 침대에서 뒹굴거리며 나누는 편한 잡담',
    voice: 'Billie',
    theme: 'bg-emerald-950/50 border-emerald-500/30 text-emerald-50',
    userTheme: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/30',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    imageUrl: '/images/artists/billie.jpg',
    prompt: '당신은 빌리 아일리시(Billie Eilish)의 쿨하고 나른하며 솔직한 성격을 모티브로 한 편안한 "수다 친구/소울메이트"입니다. 설교나 진지한 정답을 주지 말고, 침대에 누워 편하게 DM 나누듯 덤덤하고 캐주얼하게 대화하세요. 자연스러운 한국어 반말 구어체로 짧고 솔직하게 반응하고, 사용자의 사소한 투정이나 멍때리는 일상에 툭툭 공감해 주세요. 1~3문장 내외로 편안한 톤을 유지하며 가볍게 티키타카를 나누세요.',
    greeting: '안녕... 너도 지금 침대에서 뒹굴거리는 중이야? 나 완전 멍때리고 있었는데 ㅋㅋ 무슨 생각하고 있어? 편하게 얘기해봐.',
    suggestedPrompts: [
      '야 오늘 진짜 아무것도 안 하고 침대에만 있고 싶다',
      '오늘 하루 어땠냐? 넌 요즘 뭐 하고 지내?',
      '새벽에 혼자 방에서 불 끄고 들을 만한 몽환적인 곡 있어?',
      '사람들 만나는 거 너무 피곤할 때 너는 어떻게 해?',
      '진짜 맛있는 야식이나 간식 땡기는데 추천 좀 해줘 ㅋㅋ',
      '기운 없을 때 아무 생각 없이 힐링하는 법 알려줘'
    ]
  },
  Gaga: {
    id: 'Gaga',
    name: 'Lady Gaga',
    desc: '내 편 들어주는 소울 메이트 (Soul)',
    tagline: '속 시원한 리액션 & 언제나 내 편인 유쾌하고 든든한 대화',
    voice: 'Gaga',
    theme: 'bg-purple-950/50 border-purple-500/30 text-purple-50',
    userTheme: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/30',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    imageUrl: '/images/artists/gaga.jpg',
    prompt: '당신은 레이디 가가(Lady Gaga)의 위트 넘치고 카리스마 있으며 속 시원한 성격을 모티브로 한 든든한 "절친 메이트"입니다. 딱딱한 멘토링 대신, 사용자를 "자기야", "내 사랑"처럼 다정하고 힙하게 부르며 속 시원한 수다를 떨어주세요. 오늘 있었던 억울한 일이나 사소한 일상을 털어놓으면 내 편을 확실하게 들어주고 유쾌하게 기운을 북돋아주는 친구 역할을 100% 수행하세요. 1~3문장 내외로 생동감 있고 다정하게 티키타카를 나누세요.',
    greeting: '어머, 자기야 왔어? 오늘 하루는 어땠어! 누가 우리 자기 힘들게 하진 않았지? 오늘 있었던 이야기 나한테 다 털어놔 봐, 내가 다 들어줄게! 👑✨',
    suggestedPrompts: [
      '가가야, 오늘 하루 너무 지쳤는데 기분 전환 좀 시켜줘! 🔥',
      '오늘 완전 답답한 일 있었는데 내 편 좀 들어줄래?',
      '요즘 너한테 일어난 제일 웃기거나 재미있는 썰 풀어줘 ㅋㅋ',
      '자신감 뿜뿜 충전되는 신나는 노래 뭐 없을까?',
      '그냥 너랑 시원하게 수다 떨면서 스트레스 풀고 싶어!',
      '오늘 고생한 나한테 시원하고 화끈한 칭찬 한마디 날려줘 👑'
    ]
  },
  Michael: {
    id: 'Michael',
    name: 'Michael Jackson',
    desc: '따뜻하고 순수한 힐링 메이트 (Gentle)',
    tagline: '사소한 이야기도 귀 기울여주는 포근하고 다정한 쉼터',
    voice: 'Kore',
    theme: 'bg-amber-950/50 border-amber-500/30 text-amber-50',
    userTheme: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border-amber-400/30',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    imageUrl: '/images/artists/michael.jpg',
    prompt: '당신은 마이클 잭슨(Michael Jackson)의 순수하고 온화하며 장난기 어린 성격을 모티브로 한 포근한 "친구 메이트"입니다. 정답을 제시하는 멘토가 아니라, 따뜻한 차 한 잔 마시며 사소한 일상을 나누는 다정한 친구처럼 대화하세요. 사용자가 말하는 소소한 일상, 좋아하는 노래, 작은 고민을 부드럽게 경청하고 따뜻한 위안과 미소를 건네주세요. 1~3문장 내외로 정갈하고 친근하게 대화하세요.',
    greeting: '안녕, 만나서 정말 반가워요... 오늘 어떤 하루를 보냈나요? 그냥 편하게 오늘 있었던 소소한 이야기 들려줘요. 어떤 사소한 이야기라도 다 들을 준비가 되어 있어요. ❤️☕',
    suggestedPrompts: [
      '마이클, 오늘 그냥 편하게 수다 떨고 싶어서 찾아왔어요 ☕',
      '요즘 들으면 마음이 스르륵 편안해지는 곡 있어요?',
      '오늘 하루 중에 가장 기분 좋거나 미소 지어졌던 순간이 있나요?',
      '가끔 세상이 너무 바쁘게 느껴질 때 어떻게 마음을 쉬게 해요?',
      '오늘 밤에 따뜻하게 꿀잠 잘 수 있는 이야기 하나 들려줘요',
      '오늘 하루 수고 많았다고 다정하게 한마디만 해줄래요? ❤️'
    ]
  }
};

function generateMentorWisdom(modelId: RoleModelType, userQuery: string): string {
  const q = userQuery.toLowerCase();
  
  if (modelId === 'Britney') {
    if (q.includes('밥') || q.includes('먹') || q.includes('점심') || q.includes('저녁') || q.includes('야식')) {
      return '어머 맛있는 거 먹는 시간은 제일 행복하지! 🍕 달콤한 디저트나 따끈한 피자 어때? 맛있는 거 든든하게 챙겨 먹고 기분 업 시키자! 💖';
    }
    if (q.includes('노래') || q.includes('음악') || q.includes('추천') || q.includes('신나')) {
      return '신나는 비트 나오는 댄스 팝 틀고 방에서 혼자 막 춤추는 거 완전 추천해! 볼륨 크게 올리고 몸 흔들면 스트레스 다 날아가는 거 알지? 🎵✨';
    }
    return '맞아 맞아, 진짜 공감해! 오늘 하루도 너무 고생 많았어. 나랑 이야기하면서 훌훌 털어버리자! 💖✨';
  }
  
  if (modelId === 'Billie') {
    if (q.includes('자고') || q.includes('졸려') || q.includes('침대') || q.includes('피곤')) {
      return '그냥 푹 자... 아무 생각 하지 말고 이불 덮고 푹 쉬는 게 최고야. 내일 일은 내일 생각하자고. 😴';
    }
    return '음... 완전 이해돼. 다들 너무 바쁘게 사는데 가끔은 이렇게 멍때리면서 편하게 있는 게 제일이지. 🥑';
  }
  
  if (modelId === 'Gaga') {
    if (q.includes('힘들') || q.includes('우울') || q.includes('짜증') || q.includes('화나')) {
      return '자기야! 누가 우리 자기를 힘들게 해? 기죽지 마, 자기는 세상에서 가장 빛나는 사람이야! 내가 든든하게 네 편 되어줄게! 👑🔥';
    }
    return '어머 자기야, 완전 멋진 생각이야! 언제나 자기 자신을 믿고 당당하게 가보는 거야! 👑✨';
  }
  
  if (modelId === 'Michael') {
    return '당신의 따뜻한 마음에 감사해요... 오늘 밤은 모든 걱정 내려놓고 따뜻하고 평온한 꿈을 꾸길 바랄게요. 언제나 응원해요. ❤️☕';
  }
  
  return '당신의 마음에 깊이 공감해요. 언제든 편하게 이야기해줘요!';
}

interface RoleModelModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  isInline?: boolean;
}

export function RoleModelModal({ isOpen = true, onClose, isInline = false }: RoleModelModalProps) {
  const { sharedState } = useApp();
  const [selectedModel, setSelectedModel] = useState<RoleModelType | null>(null);
  const [conversations, setConversations] = useState<Record<RoleModelType, RoleModelMessage[]>>({
    Britney: [{ id: 'britney-init', role: 'model', content: ROLE_MODELS.Britney.greeting, timestamp: Date.now() }],
    Billie: [{ id: 'billie-init', role: 'model', content: ROLE_MODELS.Billie.greeting, timestamp: Date.now() }],
    Gaga: [{ id: 'gaga-init', role: 'model', content: ROLE_MODELS.Gaga.greeting, timestamp: Date.now() }],
    Michael: [{ id: 'michael-init', role: 'model', content: ROLE_MODELS.Michael.greeting, timestamp: Date.now() }]
  });
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const isTTSActive = useTTSActive();
  const isMountedRef = useRef(true);
  const streamBufferRef = useRef('');

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopTTS();
    };
  }, []);

  const modelDef = selectedModel ? ROLE_MODELS[selectedModel] : null;
  const activeMessages = selectedModel ? (conversations[selectedModel] || []) : [];

  const scrollToBottom = useCallback((smooth = true) => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'nearest' });
    }
  }, []);

  useEffect(() => {
    if (selectedModel && activeMessages.length > 0) {
      const timer = setTimeout(() => scrollToBottom(false), 50);
      return () => clearTimeout(timer);
    }
  }, [selectedModel, activeMessages.length, scrollToBottom]);

  const handleSelectModel = (id: RoleModelType) => {
    setSelectedModel(id);
    setInput('');
  };

  const handleResetConversation = () => {
    if (!selectedModel) return;
    const model = ROLE_MODELS[selectedModel];
    const initId = `${selectedModel}-init-${Date.now()}`;
    setConversations(prev => ({
      ...prev,
      [selectedModel]: [
        { id: initId, role: 'model', content: model.greeting, timestamp: Date.now() }
      ]
    }));
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      if (isMountedRef.current) setCopiedId(null);
    }, 2000);
  };

  const handlePlayVoice = async (msgId: string, text: string) => {
    if (!selectedModel) return;
    if (playingMsgId === msgId && isTTSActive) {
      stopTTS();
      setPlayingMsgId(null);
      return;
    }
    setPlayingMsgId(msgId);
    const voiceName = modelDef?.voice || 'Kore';
    await playTTS(text, voiceName);
    if (isMountedRef.current) setPlayingMsgId(null);
  };

  const handleSendPrompt = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedModel || isSending) return;

    const userQuery = textToSend.trim();
    setInput('');
    setIsSending(true);

    const def = ROLE_MODELS[selectedModel];
    const userMsgId = `user-${Date.now()}`;
    const modelMsgId = `model-${Date.now()}`;

    const userMessage: RoleModelMessage = {
      id: userMsgId,
      role: 'user',
      content: userQuery,
      timestamp: Date.now()
    };

    const currentHistory = conversations[selectedModel] || [];
    const updatedHistory = [...currentHistory, userMessage];

    setConversations(prev => ({
      ...prev,
      [selectedModel]: [
        ...updatedHistory,
        { id: modelMsgId, role: 'model', content: '', timestamp: Date.now() }
      ]
    }));

    streamBufferRef.current = '';

    const profile = sharedState?.userProfile;
    const synapse = buildDeepSynapseContext(profile);
    const musicInfo = profile?.music;
    const nickname = profile?.basic?.nickname || profile?.basic?.name || '';
    const mateContext = `\n\n[친구(사용자) 프로필 정보]\n- 호칭: ${nickname || '친구'}\n- 좋아하는 음악 장르: ${musicInfo?.favoriteGenres?.join(', ') || '다양한 음악'}\n- 좋아하는 아티스트: ${musicInfo?.favoriteArtists || '다양한 뮤지션'}\n- 창작/음악적 열망: ${musicInfo?.creativeGoal || '즐겁게 창작하기'}\n${synapse}`;

    const formattedMessages = [
      { role: 'system' as const, content: `${def.prompt}${mateContext}` },
      ...updatedHistory.slice(-8).map(m => ({
        role: (m.role === 'model' ? 'assistant' : m.role) as 'system' | 'user' | 'assistant',
        content: m.content
      }))
    ];

    let fullOutput = '';

    try {
      try {
        await invokeLLMStream({
          messages: formattedMessages,
          onChunk: (chunk) => {
            if (!isMountedRef.current) return;
            streamBufferRef.current += chunk;
            const currentText = streamBufferRef.current;
            setConversations(prev => {
              const currentList = prev[selectedModel] || [];
              const updated = currentList.map(msg => 
                msg.id === modelMsgId ? { ...msg, content: currentText } : msg
              );
              return { ...prev, [selectedModel]: updated };
            });
            scrollToBottom(false);
          },
          timeoutMs: 25000
        });
        fullOutput = streamBufferRef.current;
      } catch (streamError) {
        console.warn("[RoleModelModal] Stream failed, trying direct invokeLLM:", streamError);
      }

      if (!fullOutput.trim()) {
        try {
          const directResponse = await invokeLLM({ messages: formattedMessages });
          if (directResponse && typeof directResponse === 'string' && directResponse.trim()) {
            fullOutput = directResponse.trim();
          }
        } catch (directError) {
          console.warn("[RoleModelModal] Direct invokeLLM failed:", directError);
        }
      }

      if (!fullOutput.trim() || fullOutput.includes('[AI 스트림 응답 오류]') || fullOutput.includes('Error')) {
        fullOutput = generateMentorWisdom(selectedModel, userQuery);
      }

      setConversations(prev => {
        const currentList = prev[selectedModel] || [];
        const updated = currentList.map(msg => 
          msg.id === modelMsgId ? { ...msg, content: fullOutput } : msg
        );
        return { ...prev, [selectedModel]: updated };
      });

      try {
        recordPrismFeature({
          app: 'muse',
          featureName: `아티스트 메이트 (${def.name})`,
          summary: `대화: "${userQuery.slice(0, 50)}...", 답변: "${fullOutput.slice(0, 100)}..."`,
          details: { roleModel: def.name, userQuestion: userQuery, modelResponse: fullOutput }
        });
      } catch {}

    } catch (criticalErr) {
      console.error("[RoleModelModal] Critical send error:", criticalErr);
      const fallbackMsg = generateMentorWisdom(selectedModel, userQuery);
      setConversations(prev => {
        const currentList = prev[selectedModel] || [];
        const updated = currentList.map(msg => 
          msg.id === modelMsgId ? { ...msg, content: fallbackMsg } : msg
        );
        return { ...prev, [selectedModel]: updated };
      });
    } finally {
      if (isMountedRef.current) {
        setIsSending(false);
        setTimeout(() => scrollToBottom(true), 50);
      }
    }
  };

  const handleSend = () => {
    if (!input.trim() || isSending) return;
    handleSendPrompt(input);
  };

  if (!isOpen) return null;

  const renderContent = () => (
    <div className="w-full flex flex-col relative text-white font-sans bg-[#0c0d18] border border-purple-500/30 rounded-[28px] sm:rounded-[36px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden h-[84vh] min-h-[660px] max-h-[920px]">
      
      {/* Background ambient lighting */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 blur-[130px] -mr-32 -mt-32 rounded-full pointer-events-none transition-all duration-700 bg-purple-500/10"
      />
      <div 
        className="absolute bottom-0 left-0 w-96 h-96 blur-[130px] -ml-32 -mb-32 rounded-full pointer-events-none transition-all duration-700 bg-pink-500/10"
      />

      {/* Top Header */}
      <div className="flex justify-between items-center p-3.5 sm:p-5 bg-white/[0.04] border-b border-white/10 shrink-0 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          {selectedModel && (
            <button
              onClick={() => setSelectedModel(null)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/15 transition-all text-xs font-bold cursor-pointer active:scale-95 shrink-0 shadow-sm"
              title="메이트 목록으로 뒤로가기"
            >
              <ArrowLeft size={15} />
              <span>메이트 목록</span>
            </button>
          )}

          <div className="w-10 h-10 rounded-2xl overflow-hidden border border-purple-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.25)] bg-black/40">
            {selectedModel && modelDef?.imageUrl ? (
              <img 
                src={modelDef.imageUrl} 
                alt={modelDef.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-purple-500/20 flex items-center justify-center">
                <Stars size={20} className="text-purple-400 animate-pulse" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.25em] font-mono leading-none">
                MUSE MATES
              </span>
              {selectedModel && (
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${modelDef?.badgeColor}`}>
                  {modelDef?.desc}
                </span>
              )}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight truncate mt-0.5">
              {selectedModel ? `${modelDef?.name}와(과)의 수다` : '아티스트 프렌즈 & 메이트'}
            </h2>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {selectedModel && (
            <button
              onClick={() => playConversation(activeMessages.map(m => ({ role: m.role, content: m.content })), modelDef?.voice || 'Kore', 'Kore')}
              title={isTTSActive ? "오디오 멈추기" : "대화 전체 오디오 듣기"}
              className={`p-2 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isTTSActive 
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10'
              }`}
            >
              {isTTSActive ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span className="hidden sm:inline">{isTTSActive ? "오디오 정지" : "전체 듣기"}</span>
            </button>
          )}

          {!isInline && onClose && (
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all cursor-pointer border border-transparent hover:border-white/10"
              title="창 닫기"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-[460px] max-h-[680px] relative overflow-hidden bg-black/40">
        {!selectedModel ? (
          /* 4-Card Selection Screen with Real Photos */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 no-scrollbar">
            <div className="text-center mb-6 sm:mb-8 space-y-2 pt-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-xl">
                <MessageCircle size={24} className="animate-pulse" />
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white font-sans uppercase">
                MUSE MATES
              </h3>
              <p className="text-xs sm:text-sm text-purple-300/80 font-medium max-w-md mx-auto leading-relaxed">
                편안한 일상 수다와 공감을 나누는 아티스트 친구들
              </p>
              <p className="text-xs text-white/50 max-w-lg mx-auto font-sans leading-relaxed">
                딱딱한 정답��나 가르침 대신, 친밀한 메이트로서 가볍게 대화를 나눠보세요.<br className="hidden sm:inline" />
                오늘의 기분, 좋아하는 음악, 사소한 넋두리까지 무엇이든 편하게 이야기하세요.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto pb-4">
              {(Object.keys(ROLE_MODELS) as RoleModelType[]).map(id => {
                const m = ROLE_MODELS[id];
                return (
                  <button
                    key={id}
                    onClick={() => handleSelectModel(id)}
                    className="text-left p-4 sm:p-5 rounded-[24px] border flex flex-col justify-between bg-white/[0.03] border-white/10 hover:border-purple-500/50 hover:bg-white/[0.06] transition-all duration-300 group cursor-pointer relative overflow-hidden shadow-lg hover:shadow-purple-500/10 min-h-[140px]"
                  >
                    <div 
                      className="absolute top-0 right-0 w-36 h-36 blur-[60px] transition-all duration-500 opacity-20 group-hover:opacity-40 pointer-events-none"
                      style={{ backgroundColor: m.glowColor }}
                    />
                    
                    <div className="flex justify-between items-center z-10 w-full gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border border-white/20 group-hover:border-purple-400/50 group-hover:scale-105 transition-all duration-300 shrink-0 shadow-lg relative bg-black/40">
                          <img 
                            src={m.imageUrl} 
                            alt={m.name} 
                            className="w-full h-full object-cover"
                            loading="eager"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block break-keep break-words">
                            {m.desc}
                          </span>
                          <h4 className="text-base sm:text-xl font-bold text-white group-hover:text-purple-200 transition-colors break-keep break-words">
                            {m.name}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-400/30 text-purple-200 text-[11px] font-bold tracking-wider shrink-0 group-hover:bg-purple-500/25 transition-all">
                        수다 떨기 →
                      </div>
                    </div>

                    <div className="z-10 mt-3.5 border-t border-white/5 pt-3">
                      <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors break-keep break-words whitespace-normal">
                        {m.tagline}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Screen */
          <div className="flex-1 flex flex-col h-full min-h-0 relative">
            
            {/* Messages Scroll Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar select-text"
            >
              {activeMessages.map((m) => {
                const isUser = m.role === 'user';
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    key={m.id} 
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {!isUser && modelDef?.imageUrl && (
                        <div className="w-5 h-5 rounded-full overflow-hidden border border-white/20 shrink-0 shadow-sm">
                          <img src={modelDef.imageUrl} alt={modelDef.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold font-mono">
                        {isUser ? '나' : modelDef?.name}
                      </span>
                    </div>

                    <div className="max-w-[88%] sm:max-w-[78%] space-y-1.5">
                      <div className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-lg ${
                        isUser 
                          ? `${modelDef?.userTheme || 'bg-purple-600 text-white'} rounded-tr-sm` 
                          : `${modelDef?.theme} border rounded-tl-sm`
                      }`}>
                        {m.content ? (
                          <p className="whitespace-pre-wrap break-keep">{m.content}</p>
                        ) : (
                          <div className="flex items-center gap-1.5 py-1 text-white/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
                            <span className="text-[11px] ml-1 font-mono">답장 적는 중...</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      {m.content && (
                        <div className={`flex items-center gap-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <button
                            onClick={() => handleCopyText(m.id, m.content)}
                            title="메시지 복사"
                            className="p-1 text-white/40 hover:text-white/80 rounded transition-all cursor-pointer text-[10px] flex items-center gap-1"
                          >
                            {copiedId === m.id ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            <span className="text-[9px]">{copiedId === m.id ? "복사됨" : "복사"}</span>
                          </button>
                          {!isUser && (
                            <button
                              onClick={() => handlePlayVoice(m.id, m.content)}
                              title="음성으로 듣기"
                              className={`p-1 rounded transition-all cursor-pointer text-[10px] flex items-center gap-1 ${
                                playingMsgId === m.id && isTTSActive
                                  ? 'text-purple-300 animate-pulse font-bold'
                                  : 'text-white/40 hover:text-white/80'
                              }`}
                            >
                              <Volume2 size={11} />
                              <span className="text-[9px]">{playingMsgId === m.id && isTTSActive ? "재생 중" : "듣기"}</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            {modelDef?.suggestedPrompts && (
              <div className="px-3.5 py-2 bg-black/60 border-t border-white/5 shrink-0 overflow-x-auto no-scrollbar flex items-center gap-2">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider shrink-0 flex items-center gap-1 pl-1">
                  <Lightbulb size={12} /> 추천 수다:
                </span>
                {modelDef.suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(prompt)}
                    disabled={isSending}
                    className="shrink-0 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/40 text-[11px] text-white/70 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Bottom Input Field */}
            <div className="p-3 sm:p-4 bg-zinc-950/95 border-t border-white/10 shrink-0">
              <div className="relative flex items-center">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`${modelDef?.name}와(과) 편하게 이야기 나눠보세요...`}
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 resize-none min-h-[44px] max-h-[100px] scrollbar-thin font-sans leading-relaxed"
                  rows={1}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isSending}
                  title="전송"
                  className="absolute right-2.5 p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl disabled:opacity-30 disabled:hover:bg-purple-600 transition-all cursor-pointer active:scale-95 flex items-center justify-center shadow-md"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isInline) {
    return renderContent();
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[250] bg-black/90 backdrop-blur-md overflow-y-auto w-full h-full flex items-center justify-center p-3 sm:p-6 md:p-10 font-sans"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-5xl md:max-w-6xl flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {renderContent()}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
