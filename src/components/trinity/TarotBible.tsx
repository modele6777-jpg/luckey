import React from 'react';
import {
  Sparkles, Compass, Layers, FlipHorizontal, MessageCircle,
  Sun, Moon, Users, Eye, Scale, BookOpen,
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const TarotBible: React.FC<{ 
  onConsult: (text: string) => void;
}> = ({ onConsult }) => {
  const sectionProps = {
    subtitle: 'Tarot · TRINITY',
    color: 'border-yellow-500/20',
    textColor: 'text-yellow-400',
    bgColor: 'bg-yellow-400',
    onSelectStep: onConsult,
  };

  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-400/30 text-[10px] font-mono font-bold uppercase tracking-widest text-yellow-300">
          <Sparkles size={12} className="text-yellow-400" />
          <span>AI 타로 코칭 &amp; 기적수업 질문 가이드</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
          Tarot Bible
        </h2>
        <p className="text-sm text-yellow-400/90 uppercase tracking-[0.25em] font-bold">
          타로 리딩 &amp; 기적수업(ACIM) 바이블
        </p>
        <p className="text-xs text-white/45 max-w-2xl mx-auto leading-relaxed font-sans normal-case tracking-normal">
          78장의 카드는 무의식의 거울입니다. 루시(AI)와 함께 질문을 던지며 에고의 두려움을 기적의 시각으로 전환해 보세요.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {['대아르카나', '수트', '정·역방향', '스프레드', '직관', '기적수업'].map((tag) => (
            <span
              key={tag}
              className="text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border border-yellow-500/20 bg-yellow-500/10 text-yellow-300/90"
            >
              {tag}
            </span>
          ))}
        </div>

        
      </div>

      <BibleToolSection
        title="Fool's Journey · 광대의 여정"
        icon={Compass}
        principles={[
          '대아르카나 22장은 광대(0)부터 세계(21)까지 한 영혼의 여정입니다.',
          '카드 번호는 순서가 아니라 성장의 상징이며, 언제든 어느 단계든 올 수 있습니다.',
          '지금 뽑힌 카드는 현재 무의식이 비추는 여정의 한 장면입니다.',
        ]}
        steps={[
          '광대의 여정에서 지금 내가 어느 단계쯤인지 함께 살펴봐줘',
          '오늘의 상황을 대아르카나 여정으로 비유해 설명해줘',
          '다음에 올 수 있는 성장 단계를 타로 관점에서 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Major Arcana · 대아르카나 22"
        icon={Sparkles}
        principles={[
          '대아르카나는 인생의 큰 전환, 카르마, 영적 교훈을 나타냅니다.',
          '마법사·여사제·황제… 각 카드는 원형(Archetype)의 언어입니다.',
          '한 장만 나와도 깊은 메시지가 됩니다. 키워드보다 상징을 느껴 보세요.',
        ]}
        steps={[
          '지금 내 고민에 맞는 대아르카나 카드와 의미 알려줘',
          '최근 자주 떠오르는 카드 상징이 있다면 해석해줘',
          '대아르카나에서 오늘의 핵심 메시지 한 장 골라 설명해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Four Suits · 4수트와 원소"
        icon={Layers}
        principles={[
          '지팡이(Wands/불): 열정, 행동, 창조 · 컵(Cups/물): 감정, 관계, 직관',
          '검(Swords/공기): 생각, 갈등, 결단 · 펜타클(Pentacles/땅): 물질, 일, 건강',
          '수트가 많이 나오면 그 영역에 무의식의 초점이 맞춰져 있음을 뜻합니다.',
        ]}
        steps={[
          '내 고민이 4수트 중 어디에 해당하는지 알려줘',
          '지금 상황에서 불·물·공기·땅 중 어떤 에너지가 강한지 해석해줘',
          '수트별로 오늘 주의할 점과 강점 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Upright & Reversed · 정방향과 역방향"
        icon={FlipHorizontal}
        principles={[
          '정방향: 카드 에너지가 자연스럽게 흐르는 상태입니다.',
          '역방향: 에너지가 막히거나, 내면화되거나, 과잉·부족한 상태를 뜻합니다.',
          '역방향은 나쁜 것이 아니라, 다른 각도에서의 메시지입니다.',
        ]}
        steps={[
          '정방향과 역방향의 차이를 내 고민에 적용해 설명해줘',
          '역방향 카드가 나왔을 때 읽는 법 알려줘',
          '지금 내 상황이 정방향 에너지인지 역방향 에너지인지 함께 살펴봐줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Question Craft · 질문 세우기"
        icon={MessageCircle}
        principles={[
          '타로는 예/아니오보다 「어떻게」「무엇을 살펴볼까」에 강합니다.',
          '「~할까요?」보다 「이 상황에서 내가 알아차릴 점은?」이 더 깊은 답을 줍니다.',
          '질문이 구체적일수록 카드도 구체적으로 응답합니다.',
        ]}
        steps={[
          '내 고민을 타로에 맞는 좋은 질문으로 바꿔줘',
          '예/아니오 질문을 더 깊은 질문으로 재구성해줘',
          '오늘 데일리 타로에 쓸 질문 3가지 추천해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Three-Card · 3장 스프레드"
        icon={Sun}
        principles={[
          '과거·현재·미래, 또는 상황·장애물·조언 등 3장으로 흐름을 봅니다.',
          '가운데 카드가 현재의 핵심, 양옆이 맥락을 보여 줍니다.',
          '미래 카드는 확정이 아니라 지금 선택에 따른 가능한 방향입니다.',
        ]}
        steps={[
          '과거·현재·미래 3장 스프레드로 내 고민 읽어줘',
          '상황·장애물·조언 3장 배열법 알려줘',
          '3장 스프레드 결과를 실천 가능한 조언으로 정리해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Celtic Cross · 켈틱 크로스"
        icon={Scale}
        principles={[
          '가장 널리 쓰이는 10장 스프레드. 상황을 입체적으로 봅니다.',
          '현재, 도전, 과거, 근원, 목표, 가까운 미래, 자아, 환경, 희망·두려움, 결과.',
          '복잡한 고민일 때 전체 그림을 그리는 데 적합합니다.',
        ]}
        steps={[
          '켈틱 크로스 각 위치의 의미 쉽게 설명해줘',
          '내 고민에 켈틱 크로스를 적용해 10장 배열 가이드 해줘',
          '켈틱 크로스에서 가장 중요한 위치 3곳 짚어줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Daily Card · 오늘의 카드"
        icon={Moon}
        principles={[
          '하루 한 장은 오늘의 에너지, 주의점, 선물을 짧게 비춥니다.',
          '아침에 뽑고 저녁에 되돌아보면 카드와 하루의 연결을 느낄 수 있습니다.',
          'TRINITY 데일리 타로와 함께 쓰면 더 풍부해집니다.',
        ]}
        steps={[
          '오늘의 데일리 카드 에너지를 내 상황에 맞게 해석해줘',
          '오늘 카드 키워드를 하루 일과에 적용하는 법 알려줘',
          '저녁에 오늘의 카드를 돌아보는 성찰 질문 3개 줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Court Cards · 궁정 카드"
        icon={Users}
        principles={[
          '시종(Page)·기사(Knight)·여왕(Queen)·왕(King)— 사람, 태도, 에너지의 단계를 나타냅니다.',
          '특정 인물을 뜻하기도 하고, 내 안의 그 에너지를 뜻하기도 합니다.',
          '「누가」보다 「어떤 태도로」에 집중하면 해석이 열립니다.',
        ]}
        steps={[
          '궁정 카드가 나왔을 때 읽는 법 알려줘',
          '지금 내 고민에 해당하는 궁정 카드 에너지 설명해줘',
          '시종·기사·여왕·왕 중 지금 나에게 필요한 태도 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Intuition · 직관 읽기"
        icon={Eye}
        principles={[
          '카드 그림에서 먼저 눈에 들어오는 것, 느껴지는 것을 신뢰하세요.',
          '백과사전식 의미보다 지금 이 순간의 상징이 우선입니다.',
          'TRINITY 채팅과 함께하면 직관과 해석이 깊어집니다.',
        ]}
        steps={[
          '카드 그림만 보고 직관적으로 읽는 연습법 알려줘',
          '키워드 암기 없이 타로를 읽는 법 알려줘',
          '내 직관과 카드 상징을 연결하는 질문 가이드 해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Trinity Reading · 사주·별자리와 함께"
        icon={BookOpen}
        principles={[
          '타로는 무의식의 거울, 사주는 선천적 기운, 별자리는 현재 타이밍입니다.',
          '세 시선이 겹치는 부분이 오늘의 핵심 메시지입니다.',
          '하나가 미래를 단정하지 않습니다. 선택지와 흐름을 비춥니다.',
        ]}
        steps={[
          '내 고민을 타로·사주·별자리 세 시선으로 함께 읽어줘',
          '타로 결과와 사주 흐름을 연결해 해석해줘',
          '별자리 타이밍과 오늘의 타로 카드를 함께 해석해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="A Course in Miracles · 기적수업과 지각의 전환"
        icon={Sun}
        principles={[
          '기적수업(ACIM)은 에고의 두려운 시각을 내려놓고 성령의 사랑의 시각으로 전환하는 의식의 도약입니다.',
          '실제적인 것은 위협받을 수 없으며, 실제적이지 않은 것은 존재하지 않습니다.',
          '타로 카드가 비추는 무의식의 두려움을 기적수업의 시각으로 바라볼 때 즉각적인 평화가 회복됩니다.',
        ]}
        steps={[
          '오늘 뽑힌 카드에서 에고의 두려움을 지우고 성령의 눈으로 재해석해줘',
          '기적수업의 원리로 오늘의 인간관계 갈등을 치유하는 법 알려줘',
          '두려움 대신 사랑을 선택하는 기적수업 3단계 명상 가이드해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Holy Instant & True Forgiveness · 거룩한 순간과 참된 용서"
        icon={Sparkles}
        principles={[
          '거룩한 순간(Holy Instant)은 과거의 죄책감과 미래의 불안을 멈추고 온전한 신의 평화에 머무는 1분의 정지입니다.',
          '진정한 용서는 일어난 일이 에고의 꿈이었음을 자각하고 상대와 나의 온전한 신성을 회복하는 것입니다.',
          '무방비함 속에 참된 안전이 있으며, 방어하지 않을 때 영원한 평화가 깃듭니다.',
        ]}
        steps={[
          '오늘 1분 거룩한 순간으로 마음을 정화하는 명상 루틴 알려줘',
          '나를 아프게 한 사람을 기적수업의 참된 용서로 놓아주는 연습 알려줘',
          '기적수업 365 워크북 중 오늘 나에게 필요한 핵심 레슨 처방해줘',
        ]}
        {...sectionProps}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-yellow-500/5 border border-yellow-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 shadow-2xl relative z-10">
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-black text-yellow-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">
            Tarot Note
          </h3>
          <p className="text-xl md:text-xl text-yellow-100 leading-relaxed font-sans max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;카드는 미래를 정하지 않습니다. 지금 당신 안에서 이미 알고 있는 것을 비춥니다. 질문하고, 느끼고, 선택하세요.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};