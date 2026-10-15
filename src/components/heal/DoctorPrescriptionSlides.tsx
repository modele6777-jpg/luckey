import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Utensils, Award, Palette, Sparkles, AlertCircle } from 'lucide-react';

interface ChakraData {
  name: string;
  sanskrit: string;
  color: string;
  subColor: string;
  deficientState: string;
  culinary: {
    title: string;
    description: string;
    steps: string;
  };
  yoga: {
    title: string;
    description: string;
    steps: string;
  };
  aroma: {
    title: string;
    description: string;
    steps: string;
  };
}

const CHAKRA_PROFILES: ChakraData[] = [
  // Red - Root Chakra
  {
    name: '제1차크라: 물라다라 (Root Chakra)',
    sanskrit: 'Muladhara',
    color: 'oklch(0.55 0.20 20)',
    subColor: 'border-red-500/30 text-red-400 bg-red-500/10',
    deficientState: '생명 기반 약화, 만성 피로 및 정서적 불안감 저하',
    culinary: {
      title: '구운 비트 허브 수프 & 구운 뿌리채소 버무리',
      description: '단단히 땅에 뿌리를 내린 뿌리채소의 단맛과 비트의 선명한 철분이 생존 에너지와 대지의 온전성 수치를 즉시 복구합니다.',
      steps: '신선한 비트와 도라지를 오븐에 구워 야생 가을 꿀, 타임 허브와 가볍게 섞어 내십시오. 따뜻한 성질이 피로를 이완합니다.'
    },
    yoga: {
      title: '그라운딩 아기 자세 (Balasana with Grounding)',
      description: '이마를 완전히 바닥에 대고 골반을 낮춤으로써, 대지와의 접지 정렬을 복구하고 숨겨진 두려움 불안을 배제합니다.',
      steps: '무릎을 꿇고 앉아 상체를 허벅지 위로 전면 절제하듯 숙인 후 양팔을 뒤로 뻗어 완전한 무방비의 이안을 5분간 유지하세요.'
    },
    aroma: {
      title: '시더우드 & 파출리 절대 안식 성수 (Cedarwood Essence)',
      description: '빽빽하고 깊은 숲속 수목의 숨결인 시더우드가 흩날리는 전위 에너지를 하나로 단단하게 묶어 진정시킵니다.',
      steps: '스프레이 성수를 손목 안쪽에 가볍게 안착시킨 뒤 양손을 부드럽게 대어 3초간 비음 정조율법으로 들이마십니다.'
    }
  },
  // Orange - Sacral Chakra
  {
    name: '제2차크라: 스와디스타나 (Sacral Chakra)',
    sanskrit: 'Svadhishthana',
    color: 'oklch(0.65 0.22 55)',
    subColor: 'border-orange-500/30 text-orange-400 bg-orange-500/10',
    deficientState: '창조성 결여, 소외감, 감정 및 생체 유동 흐름 제동',
    culinary: {
      title: '오렌지 시트러스 크림 단호박 퓌레',
      description: '황금 호박의 풍성함과 갓 구운 당근의 카로틴이 억제되었던 생명 영감과 주황빛 활기 리듬을 강하게 가동합니다.',
      steps: '부드럽게 삶은 단호박 골격을 퓌레 형태로 으깬 뒤 오렌지 껍질 제스트와 호두 조각을 올려 따뜻한 온도로 섭취하세요.'
    },
    yoga: {
      title: '깊은 이완 나비 자세 (Baddha Konasana Flow)',
      description: '골반 유동 축에 잔존해 있는 만성 스트레스 장벽과 신체 에너지의 막힘 증상을 가벼운 파도 움직임으로 풀어줍니다.',
      steps: '발바닥을 조용히 맞붙이고 무릎을 나비 날개처럼 아래로 부드럽게 이완하며, 척추 정렬을 유지한 채 2분간 상체를 앞으로 내빕니다.'
    },
    aroma: {
      title: '네롤리 & 일랑일랑 천연 해방 퍼퓸 (Neroli Bloom)',
      description: '밝음과 우아함의 표상인 네롤리 오일 꽃잎이 이기적인 억압 기제를 녹여내고 자애로운 충동 기운을 불어넣습니다.',
      steps: '공기 중에 가볍게 디퓨징한 후 향기가 부드러운 안개처럼 안착되는 동안 배꼽 깊은 주위에 양손을 대고 숨 쉬세요.'
    }
  },
  // Yellow - Solar Plexus Chakra
  {
    name: '제3차크라: 마니푸라 (Solar Plexus Chakra)',
    sanskrit: 'Manipura',
    color: 'oklch(0.75 0.18 85)',
    subColor: 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10',
    deficientState: '자신감 저하, 보상 회로 파동 결여, 소화 온기 저조',
    culinary: {
      title: '가벼운 강황 렌틸 달(Dahl) & 구운 바나나 토스트',
      description: '체온 조절을 위한 최고의 황금 향신료인 강황과 저항성 전분이 소화 불꽃을 지피고 자아 실현 의지를 자극합니다.',
      steps: '렌틸콩을 뭉근히 끓여 유기농 강황가루로 온화하게 빛을 내어 통곡물 토스트 바인더와 매치해 느리게 씹어 넘깁니다.'
    },
    yoga: {
      title: '의지 점화 명치 코브라 자세 (Bhujangasana Center)',
      description: '수축되어 굳어 있던 흉부 명치 영역과 소화계를 강력히 견인 개방하여 내면의 활화산 같은 투지와 의욕을 깨웁니다.',
      steps: '엎드린 상태에서 골반을 접지한 채 가슴 앞을 양팔 지지대로 척추의 거대한 반원을 그리는 아치 감각으로 밀어 올립니다.'
    },
    aroma: {
      title: '진저 & 레몬글라스 태양 정화 성수 (Ginger Aura)',
      description: '스파이시 정수와 프레시한 레몬그라스 기류가 날카로운 피로 물질을 즉시 기화해 버리고 중심 힘을 단단히 세웁니다.',
      steps: '맥박 뛰는 경추 목덜미 주위에 가볍게 분사하며 손끝으로 에너지를 마사지하듯 가볍게 탭합니다.'
    }
  },
  // Green - Heart Chakra
  {
    name: '제4차크라: 아나하타 (Heart Chakra)',
    sanskrit: 'Anahata',
    color: 'oklch(0.68 0.15 145)',
    subColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    deficientState: '가슴 답답함, 관계의 방어기제 증가, 자비와 포용 결여',
    culinary: {
      title: '바질 페스토 아보카도 카프레제 코덱스',
      description: '신선한 생명 녹색 엽록소를 가득 담은 바질 잎과 버터 같은 명약 아보카도가 상처받은 가슴 신경층을 윤택하게 감싸 안아줍니다.',
      steps: '생바질을 올리브유와 함께 갈아 신선한 그린 토마토, 아보카도 피스와 조화롭게 곁들여 한 포크 드십시오.'
    },
    yoga: {
      title: '하늘 수용 낙타 자세 (Modified Ustrasana)',
      description: '인간관계의 장벽과 외로움으로 움츠러든 어깨와 흉골을 개방하여 우주와 일맥통하는 무조건적 자비 진동을 수용합니다.',
      steps: '무릎을 세우고 앉아 양손을 골반 뒤에 받칩니다. 가슴을 영혼의 제단이라 의식하고 우주 천장 쪽으로 높게 밀어 올리세요.'
    },
    aroma: {
      title: '다마스크 로즈 & 제라늄 소울 워터 (Damask Rose)',
      description: '가장 숭고한 사랑의 주파수인 순수 로즈 에센스가 미워하고 경계하는 가슴의 냉증을 단번에 뜨겁게 해동합니다.',
      steps: '심장 한복판(미디엄 가슴 위치)에 부드럽게 바르며 숨을 길게 들이쉬어 내적 공명이 완전히 차오름을 만끽하세요.'
    }
  },
  // Blue - Throat Chakra
  {
    name: '제5차크라: 비슈다 (Throat Chakra)',
    sanskrit: 'Vishuddha',
    color: 'oklch(0.60 0.16 220)',
    subColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    deficientState: '표출의 억제, 목의 긴장, 목소리의 힘 약화, 감정 잔소음 체류',
    culinary: {
      title: '캐모마일 허니 배 배합 콤포트',
      description: '목 성대 보호용 청정 배 과즙과 시원한 블루베리가 목 안의 이물감과 고열을 배출하여 맑은 표현의 축을 다듬어 줍니다.',
      steps: '과육을 얇게 썰어 은은한 캐모마일 차에 따뜻하게 달이며 소량의 유기 꿀을 첨가하여 침처럼 가만히 삼킵니다.'
    },
    yoga: {
      title: '풍요로운 소통 물고기 자세 (Matsyasana Release)',
      description: '앞목 지각 관류를 넓혀 목구멍 깊이 누적된 만성 화병 정체 리듬을 해소하고 투명한 자기 주장을 해방합니다.',
      steps: '바르게 누워 양 손바닥을 엉덩이 아래에 밀어 넣습니다. 팔꿈치로 매트를 강하게 밀며 정수리를 기적처럼 바닥에 대어 안착합니다.'
    },
    aroma: {
      title: '유칼립투스 & 페퍼민트 디톡스 가디언 (Eucalyptus Pure)',
      description: '인후에 드리운 끈적한 피로 피막을 완전히 지워 버리고 목소리와 소통 에너지에 푸른 환기를 선물합니다.',
      steps: '침대 주위나 옷깃에 2회 가볍게 분무해 깊숙이 안개 호흡을 취하며 푸른 우주 기운이 기관지에 닿는 것을 감각하세요.'
    }
  },
  // Indigo - Third Eye Chakra
  {
    name: '제6차크라: 아즈나 (Third Eye Chakra)',
    sanskrit: 'Ajna',
    color: 'oklch(0.40 0.16 275)',
    subColor: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    deficientState: '생각 과부하, 이성의 과잉, 깊은 수면 방해, 직관 왜곡',
    culinary: {
      title: '블랙베리 멀베리 발효 요거트 볼 & 아몬드',
      description: '안토시아닌과 아몬드의 마그네슘이 전두엽과 뇌 속의 복잡한 활성 잔여물을 지우고 예리하고 영적인 마음 눈을 깨워 놓습니다.',
      steps: '다크베리와 볶은 견과류를 요구르트 바탕에 편안히 배치하고 시각 장치를 완전히 잠재우며 고요하게 은미해 보세요.'
    },
    yoga: {
      title: '직관 회복 돌고래 호흡 (Dolphin Pose Awakening)',
      description: '머리에 고른 뇌척수액 혈행을 공급함으로써 과도한 잡념 뇌파인 베타파를 숙면과 신성이 오가는 알파파로 빠르게 전조합니다.',
      steps: '팔꿈치를 어깨너비로 대어 바닥에 고정하고 엉덩이를 천장 쪽으로 올린 뒤 고개를 느리게 늘어뜨려 미간을 깊이 이완하십시오.'
    },
    aroma: {
      title: '프랭킨센스 & 와일드 마조람 디바인 엑스트랙트 (Frankincense)',
      description: '가장 영적이고 성스러운 오일로 불리는 프랑킨센스가 좌뇌와 우뇌의 충돌을 가라앉히고 오직 고요한 주시자 상태로 인도합니다.',
      steps: '미간 사이 양가 손가락 끝 혹은 배게 측면에 가볍게 스포이팅한 후 자극 없이 내면의 블랙 전광판을 마주하듯 응시합니다.'
    }
  },
  // Violet - Crown Chakra
  {
    name: '제7차크라: 사하스라라 (Crown Chakra)',
    sanskrit: 'Sahasrara',
    color: 'oklch(0.45 0.15 310)',
    subColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    deficientState: '만성 편두통, 영성적 고립, 자아에의 과몰입, 절대 불안',
    culinary: {
      title: '백련초꽃 백차 디톡스 리프래시',
      description: '가장 지적인 디톡스를 지향하는 은색 백차와 한 송이의 건조 꽃잎이 오직 맑은 비워냄의 절대 해독에만 초점을 맞춥니다.',
      steps: '한 잔의 미지근한 물에 은빛 백차와 꽃잎을 3분 우려낸 후, 천주 뇌간에 빛이 닿는 것을 시각화하며 차분히 마시십시오.'
    },
    yoga: {
      title: '내려놓음 완전 송장 자세 (Ultimate Savasana)',
      description: '자기 자신마저 완전히 지워 버리고 우주의 무조건적 공생 리듬에 전신을 의탁하는 완성의 자세입니다.',
      steps: '바닥에 대 자로 넓게 누워 눈을 감습니다. 손바닥은 하늘을 향하며 손가락, 발끝, 미세 혈선까지 완전한 이완만을 허용합니다.'
    },
    aroma: {
      title: '라벤더 & 화이트 샌달우드 템플 그라운드 (Temple Sandalwood)',
      description: '고고한 수목과 프렌치 라벤더가 뇌의 만성 두통 파동을 침묵하게 만들며, 우주적 통합과 완전한 해탈의 자리를 냅니다.',
      steps: '안대를 착용하기 전 관자놀이에 가벼운 릴렉스 터치 형태로 입히고 조용히 오르내리는 자신의 단전 호흡만을 관찰하십시오.'
    }
  }
];

interface SlidesProps {
  coherence: number;
  onSelectOption?: (text: string) => void;
}

export const DoctorPrescriptionSlides: React.FC<SlidesProps> = ({ coherence, onSelectOption }) => {
  const [slideIdx, setSlideIdx] = useState(0);

  // Derive which chakra profile matches based on coherence (0 to 6)
  const profileIdx = Math.floor((coherence * 123) % CHAKRA_PROFILES.length);
  const profile = CHAKRA_PROFILES[profileIdx];

  const slides = [
    {
      id: 'culinary',
      category: '차크라 에너지 영양 치유 요리',
      icon: Utensils,
      color: 'from-amber-500/20 via-orange-500/5 to-transparent',
      title: profile.culinary.title,
      description: profile.culinary.description,
      steps: profile.culinary.steps,
      actionPrompt: `차크라 영양요리: [${profile.culinary.title}]의 효능과 추가 대체 레시피가 궁금해.`,
    },
    {
      id: 'yoga',
      category: '추천 자율신경 이완 요가 자세',
      icon: Award,
      color: 'from-emerald-500/20 via-teal-500/5 to-transparent',
      title: profile.yoga.title,
      description: profile.yoga.description,
      steps: profile.yoga.steps,
      actionPrompt: `차크라 요가테라피: [${profile.yoga.title}]의 정확한 정렬 호흡 주기와 부작용 방지법 알려줘.`,
    },
    {
      id: 'aroma',
      category: '추천 천상 아로마 성수 향기',
      icon: Palette,
      color: 'from-purple-500/20 via-violet-500/5 to-transparent',
      title: profile.aroma.title,
      description: profile.aroma.description,
      steps: profile.aroma.steps,
      actionPrompt: `차크라 아로마테라피: [${profile.aroma.title}]의 기원과 성수 조향 실천 매뉴얼 알려줘.`,
    }
  ];

  const currentSlide = slides[slideIdx];
  const Icon = currentSlide.icon;

  const nextSlide = () => {
    setSlideIdx((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideIdx((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="doctor-prescription-carousel" className="space-y-4 rounded-3xl border border-emerald-500/15 bg-[#070b07]/80 p-5 md:p-6 backdrop-blur-md relative overflow-hidden font-sans">
      
      {/* Tiny Header Badge */}
      <div className="flex flex-col min-[4500px]:flex-row justify-between items-start md:items-center gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400/90 uppercase font-mono">
            MIND SOUL DOCTOR PRE-SCIENTIFIC CAROUSEL
          </span>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold ${profile.subColor} font-mono uppercase tracking-widest`}>
          {profile.sanskrit}
        </div>
      </div>

      {/* Deficient Chakra State Panel */}
      <div className="bg-white/[0.01] border border-white/5 p-3 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="space-y-0.5">
          <span className="text-[9px] text-white/30 tracking-wider uppercase font-mono block">부족/막힌 에너지 식별 장치</span>
          <h4 className="text-xs font-bold text-emerald-200">{profile.name}</h4>
        </div>
        <div className="text-[10px] text-white/65 leading-relaxed bg-black/40 border border-white/5 px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 font-sans max-w-sm">
          <AlertCircle size={12} className="text-amber-400/80 shrink-0" />
          <span>{profile.deficientState}</span>
        </div>
      </div>

      {/* Giant Slider Frame */}
      <div className="relative min-h-[190px] flex items-center justify-center py-4 bg-gradient-to-br from-zinc-950 to-[#040804] border border-white/5 rounded-2xl overflow-hidden group/carousel">
        
        {/* Sliding card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={`w-full px-12 md:px-14 flex flex-col items-center text-center space-y-3 z-10 bg-gradient-to-r ${currentSlide.color}`}
          >
            <div className="w-11 h-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400/90 shadow-md">
              <Icon size={20} className="stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-white/40 uppercase tracking-[0.15em] font-bold block font-mono">
                {currentSlide.category} (Slide {slideIdx + 1}/3)
              </span>
              <h5 className="text-sm md:text-base font-bold text-white tracking-wide">
                {currentSlide.title}
              </h5>
            </div>

            <p className="text-xs text-white/70 max-w-lg leading-relaxed font-sans px-2">
              {currentSlide.description}
            </p>

            <div className="text-[11px] text-emerald-300 bg-emerald-500/5 border border-emerald-500/10 px-3.5 py-2 rounded-xl leading-relaxed text-center font-sans max-w-md w-full">
              <span className="font-extrabold uppercase text-[9px] tracking-wider block opacity-75 mb-0.5 font-mono">★ 처방 가이드 규칙 (Usage)</span>
              {currentSlide.steps}
            </div>

            {onSelectOption && (
              <button
                onClick={() => onSelectOption(currentSlide.actionPrompt)}
                className="text-[9px] font-black uppercase text-emerald-400 border border-emerald-400/20 hover:bg-emerald-400/10 hover:border-emerald-400/40 px-3 py-1 rounded-lg transition-all cursor-pointer font-sans"
              >
                닥터에게 추가 질문하기
              </button>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-white/60 hover:text-white transition-colors cursor-pointer select-none border border-white/5 z-20 hover:scale-105 active:scale-95"
          style={{ cursor: 'pointer' }}
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2.5 p-2 rounded-full bg-zinc-900/60 hover:bg-zinc-800 text-white/60 hover:text-white transition-colors cursor-pointer select-none border border-white/5 z-20 hover:scale-105 active:scale-95"
          style={{ cursor: 'pointer' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-1.5 pt-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setSlideIdx(idx)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === slideIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};
