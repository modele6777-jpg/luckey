import React from 'react';
import {
  KeyRound, Heart, Eye, Sparkles, Sun, Gift, Feather, BookOpen,
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const SecretBible: React.FC<{ 
  onConsult: (text: string) => void;
}> = ({ onConsult }) => {
  const sectionProps = {
    subtitle: 'The Secret · ORANGE',
    color: 'border-amber-500/20',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-400',
    onSelectStep: onConsult,
  };

  return (
    <div className="space-y-12 py-6">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300">
          <Sparkles size={12} className="text-amber-400" />
          <span>AI 코칭 &amp; 끌어당김 질문 가이드</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
          Secret Bible
        </h2>
        <p className="text-sm text-amber-400/90 uppercase tracking-[0.25em] font-bold">
          론다 번의 시크릿 — 끌어당김의 법칙 바이블
        </p>
        <p className="text-xs text-white/45 max-w-2xl mx-auto leading-relaxed font-sans normal-case tracking-normal">
          생각과 감정이 현실을 만듭니다. 루시(AI)와 함께 질문을 던지며 당신의 진동수를 원하는 주파수에 맞추는 코칭 가이드입니다.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {['Ask', 'Believe', 'Receive'].map((step) => (
            <span
              key={step}
              className="text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-300/90"
            >
              {step}
            </span>
          ))}
        </div>

        
      </div>

      <BibleToolSection
        title="Ask · 명확한 요청"
        icon={KeyRound}
        principles={[
          '우주는 명확한 주문에 응답합니다. 무엇을 원하는지 구체적으로 말하세요.',
          '원하지 않는 것이 아니라 원하는 것에 집중하세요.',
          '소원은 이미 이루어진 것처럼 현재형으로 표현할수록 강해집니다.',
        ]}
        steps={[
          '오늘 우주에 요청하고 싶은 것을 한 문장으로 명확히 정리해줘',
          '원하지 않는 것 대신 원하는 것만 담은 소원 문장 만들어줘',
          '내 소원을 이미 이루어진 것처럼 현재형으로 바꿔줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Believe · 믿음과 확신"
        icon={Sparkles}
        principles={[
          '믿음은 이미 받았다는 확신입니다. 의심은 끌어당김을 약하게 합니다.',
          '확언은 반복할수록 무의식에 새겨집니다.',
          '믿음은 느낌으로 확인됩니다. 몸이 편안해질 때 믿음이 자리 잡습니다.',
        ]}
        steps={[
          '내 소원을 믿게 도와주는 시크릿 확언 3개 만들어줘',
          '의심이 올라올 때 되뇌어볼 믿음의 문장 알려줘',
          '이미 받았다고 느끼게 하는 짧은 명상 가이드 해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Receive · 받아들이기"
        icon={Gift}
        principles={[
          '받아들임은 저항을 내려놓는 것입니다.',
          '좋은 일이 올 수 있는 여지를 마음에 열어 두세요.',
          '받는다는 것은 감사와 함께 합니다. 감사는 더 많은 좋은 일을 끌어당깁니다.',
        ]}
        steps={[
          '오늘 우주의 선물을 받을 준비하는 마음가짐 알려줘',
          '저항을 내려놓고 받아들이는 3단계 실천법 알려줘',
          '저녁에 하루를 감사로 마무리하는 시크릿 루틴 짜줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Gratitude · 감사의 자석"
        icon={Heart}
        principles={[
          '감사는 가장 빠른 끌어당김 주파수입니다.',
          '이미 가진 것에 감사할수록 더 많은 풍요가 옵니다.',
          '감사는 부족함이 아니라 풍요의 관점을 열어 줍니다.',
        ]}
        steps={[
          '오늘 감사할 것 10가지를 함께 떠올려줘',
          '힘든 상황 속에서도 감사를 찾는 시크릿 연습 알려줘',
          '감사 일기를 5분 안에 쓰는 방법 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Visualization · 시각화"
        icon={Eye}
        principles={[
          '뇌는 생생한 상상을 실제 경험처럼 받아들입니다.',
          '68초 이상 생생하게 상상하면 끌어당김의 회로가 켜집니다.',
          '시각화할 때 감정까지 함께 느껴야 힘이 실어집니다.',
        ]}
        steps={[
          '내 소원이 이미 이루어진 장면을 68초 시각화 가이드로 안내해줘',
          '눈을 감고 상상할 5가지 감각 디테일 알려줘',
          '시각화 후 기분을 붙잡는 짧은 확언 만들어줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Good Feeling · 좋은 기분의 주파수"
        icon={Sun}
        principles={[
          '같은 주파수끼리 끌어당깁니다. 좋은 기분은 좋은 일을 부릅니다.',
          '기분이 낮을 때는 먼저 기분을 올리는 작은 것부터 하세요.',
          '기분 전환은 끌어당김의 응급처치입니다.',
        ]}
        steps={[
          '지금 기분을 5분 안에 올리는 시크릿 방법 5가지 알려줘',
          '부정적 생각이 반복될 때 주파수 바꾸는 법 알려줘',
          '하루 종일 좋은 주파수를 유지하는 루틴 짜줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Acting As If · 이미 이루어진 것처럼"
        icon={Feather}
        principles={[
          '행동은 믿음을 현실로 만드는 다리입니다.',
          '이미 원하는 삶을 사는 사람처럼 작은 선택을 하세요.',
          '말과 태도가 바뀌면 현실의 속도도 바뀝니다.',
        ]}
        steps={[
          '내 소원이 이미 이루어졌다면 오늘 어떻게 행동할지 상상해줘',
          '이미 이루어진 것처럼 말하는 문장 5개 만들어줘',
          '오늘 당장 할 수 있는 acting-as-if 작은 행동 3가지 추천해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="The Magic Rock & Magic Check · 감사의 돌과 우주 백지수표"
        icon={Sparkles}
        principles={[
          '『더 매직(The Magic)』의 핵심 실천 도구인 감사의 돌과 우주 백지수표입니다.',
          '매일 밤 잠들기 전 감사의 돌을 쥐고 하루 중 가장 감사했던 일을 떠올리며 감사의 주파수로 잠듭니다.',
          '우주 은행으로부터 필요한 풍요를 지급받는 상징적 수표를 발행하여 눈에 보이는 곳에 두고 기쁨을 느낍니다.',
        ]}
        steps={[
          '오늘 밤 감사의 돌을 쥐고 잠드는 3분 명상 루틴 알려줘',
          '우주 백지수표를 활용해 재정적 풍요를 끌어당기는 방법 알려줘',
          '돈에 대한 결핍 공포를 감사의 돌로 지우는 연습 가이드해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Scripting & Magic Dust · 스크립팅과 마법의 가루"
        icon={Gift}
        principles={[
          '소원이 완벽히 이루어진 미래의 하루를 소설처럼 일기로 기록하는 스크립팅 기법입니다.',
          '오늘 마주치는 모든 사람(직원, 가족, 이웃)에게 마음속으로 빛나는 감사의 마법 가루를 뿌려 축복합니다.',
          '타인을 향한 축복과 감사는 100배가 되어 당신의 삶으로 되돌아옵니다.',
        ]}
        steps={[
          '내 소원이 완벽히 실현된 하루를 스크립팅 일기 예시로 써줘',
          '타인에게 감사의 마법 가루를 뿌리는 일상 실천 루틴 알려줘',
          '기분이 다운될 때 5분 만에 주파수를 올리는 시크릿 전환 장치 목록 짜줘',
        ]}
        {...sectionProps}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-amber-500/5 border border-amber-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-amber-500/20 flex items-center justify-center border border-amber-500/30 shadow-2xl relative z-10">
          <KeyRound className="w-8 h-8 text-amber-400" />
        </div>
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">
            Secret Note
          </h3>
          <p className="text-xl md:text-xl text-amber-100 leading-relaxed font-sans max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;당신이 생각하는 것, 느끼는 것, 믿는 것이 당신을 끌어당깁니다. 오늘부터 우주에 명확히 요청하고, 믿으며, 감사하며 받아들이세요.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};