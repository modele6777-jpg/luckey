import React from 'react';
import {
  Heart, Sparkles, Baby, ShieldCheck, Droplets, KeyRound, Wind, Eraser, Sun, Waves, BookOpen,
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const HoponoponoBible: React.FC<{ 
  onConsult: (text: string) => void;
}> = ({ onConsult }) => {
  const sectionProps = {
    subtitle: "Ho'oponopono · BLUEBIRD",
    color: 'border-sky-500/20',
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-400',
    onSelectStep: onConsult,
  };

  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-[10px] font-mono font-bold uppercase tracking-widest text-sky-300">
          <Sparkles size={12} className="text-sky-400" />
          <span>AI 코칭 &amp; 정화 질문 가이드</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">
          Ho&apos;oponopono Bible
        </h2>
        <p className="text-sm text-sky-400/90 uppercase tracking-[0.25em] font-bold">
          호오포노포노 · 제로 리밋 정화 바이블
        </p>
        <p className="text-xs text-white/45 max-w-2xl mx-auto leading-relaxed font-sans normal-case tracking-normal">
          하와이 전통 정화법과 조 비탈레의 제로 리밋을 바탕으로, 루시(AI)와 1:1 대화를 나누며 잠재의식의 기억을 정화하고 평화를 되찾는 질문 가이드입니다.
        </p>
        <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
          {['미안합니다', '용서하세요', '감사합니다', '사랑합니다'].map((phrase) => (
            <span
              key={phrase}
              className="text-[9px] font-bold tracking-[0.1em] px-2.5 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 text-sky-300/90"
            >
              {phrase}
            </span>
          ))}
        </div>

        
      </div>

      <BibleToolSection
        title="Four Phrases · 네 가지 정화 구절"
        icon={Heart}
        principles={[
          '호오포노포노의 핵심은 네 가지 구절입니다. 미안합니다, 용서하세요, 감사합니다, 사랑합니다.',
          '이 말은 남에게 하는 것이 아니라, 잠재의식 속 기억을 정화할 때 씁니다.',
          '반복할수록 판단과 억압된 감정이 부드럽게 풀립니다.',
        ]}
        steps={[
          '지금 내 마음에 네 가지 정화 구절을 적용하는 방법 알려줘',
          '오늘 나를 괴롭히는 생각에 맞춤 정화 주문 만들어줘',
          '네 구절을 하루 종일 반복하는 실천 루틴 짜줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Zero Limits · 제로 리밋"
        icon={Sparkles}
        principles={[
          '조 비탈레(Zero Limits)는 한계 없는 정화가 가능하다고 합니다.',
          '내가 경험하는 모든 것에는 내 잠재의식의 기억이 담겨 있습니다.',
          '바깥을 바꾸기 전에, 먼저 안의 기억을 정화합니다.',
        ]}
        steps={[
          '제로 리밋이 말하는 정화의 원리 쉽게 설명해줘',
          '내가 겪는 문제와 잠재의식 기억의 연결 알려줘',
          '한계 없이 정화한다는 마음가짐 어떻게 갖는지 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Unihipili · 우니히피리 (잠재의식)"
        icon={Baby}
        principles={[
          '하와이 전통에서 우니히피리는 잠재의식·내면 아이에 해당합니다.',
          '억압된 기억과 감정은 우니히피리에 쌓여 반복되는 패턴을 만듭니다.',
          '네 가지 구절은 우니히피리를 다정하게 씻어 주는 방법입니다.',
        ]}
        steps={[
          '우니히피리에게 정화 구절을 전하는 방법 알려줘',
          '반복되는 부정적 생각이 잠재의식에서 오는지 함께 살펴봐줘',
          '내면 아이를 안아주며 정화하는 짧은 명상 가이드 해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="100% Responsibility · 100% 책임"
        icon={ShieldCheck}
        principles={[
          '모르나 린 박사는 100% 책임을 진다고 말합니다. 비난이 아니라 정화의 열쇠입니다.',
          '내 안의 어떤 기억이 이 상황을 만들었는지 정화할 수 있습니다.',
          '책임을 지는 순간, 변화의 주도권이 돌아옵니다.',
        ]}
        steps={[
          '100% 책임이 무엇인지 쉽게 설명해줘',
          '지금 힘든 상황에서 내가 정화할 기억 찾는 법 알려줘',
          '타인을 탓하지 않고 정화로 돌아가는 연습 해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Blue Solar Water · 블루솔라워터"
        icon={Droplets}
        principles={[
          '파란 유리병에 물을 담아 햇빛(또는 실내 조명)에 비춥니다.',
          '마시거나 피부에 바르며 네 가지 구절을 읊습니다.',
          '물처럼 마음의 탁함을 씻어내는 실천 도구입니다.',
        ]}
        steps={[
          '집에서 블루솔라워터 만드는 방법 단계별로 알려줘',
          '블루솔라워터 마시며 정화하는 루틴 짜줘',
          '오늘 씻고 싶은 생각에 맞춘 블루솔라워터 주문 만들어줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Ceeport · 치포트키"
        icon={KeyRound}
        principles={[
          '치포트키(Ceeport)는 잠재의식의 문을 여는 정화 열쇠입니다.',
          '눈에 보이거나 마음속으로 빛나는 열쇠를 그립니다.',
          '막힌 기억 앞에서 문을 연다고 상상하며 네 구절을 읊습니다.',
        ]}
        steps={[
          '치포트키 시각화 정화법 단계별로 안내해줘',
          '반복되는 생각 앞에서 치포트키로 문 여는 연습 해줘',
          '치포트키와 네 구절을 함께 쓰는 5분 루틴 짜줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Ha & Eraser · 하 호흡과 지우개"
        icon={Eraser}
        principles={[
          '「하(Ha)」— 입을 크게 벌리고 길게 내쉬며 기억을 보냅니다.',
          '「지우개」— 손에 지우개를 쥐거나 상상하며 판단과 기억을 지웁니다.',
          '호흡과 상상만으로도 집에서 바로 할 수 있는 정화법입니다.',
        ]}
        steps={[
          '하 호흡으로 기억을 지우는 방법 알려줘',
          '지우개 시각화하며 네 구절 읊는 연습 해줘',
          '스트레스 순간에 30초 하 호흡 정화법 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Salt Water · 하와이안 소금물"
        icon={Waves}
        principles={[
          '천연 소금과 물로 공간과 마음을 정화합니다.',
          '손 씻기, 공간 뿌리기, 목욕에 활용할 수 있습니다.',
          '소금은 오래된 에너지를 흡수하고 맑게 합니다.',
        ]}
        steps={[
          '하와이안 소금물 만드는 법과 사용법 알려줘',
          '집 공간 정화에 소금물 쓰는 방법 알려줘',
          '소금물과 네 구절을 함께 쓰는 저녁 루틴 짜줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Morrnah's Prayer · 모르나의 기도"
        icon={Sparkles}
        principles={[
          '하와이 인간문화재 모르나 린 여사의 공식 정화 기도문입니다.',
          '창조 이래 현재까지 얽힌 모든 조상과 가족의 부정적인 기억과 파동을 끊어내고 순수한 빛으로 변환합니다.',
          '중요한 일이나 관계의 매듭 앞에서 깊은 울림으로 낭독합니다.',
        ]}
        steps={[
          '모르나의 기도로 과거의 조상 및 가족 기억을 정화하는 법 알려줘',
          '인간관계 갈등 상황에서 모르나의 기도 실천 루틴 안내해줘',
          '모르나의 기도 전문과 함께하는 5분 정화 명상 가이드 해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title={"'I' Am the 'I' & Peace of 'I' · 「나」의 자아와 평화"}
        icon={Sun}
        principles={[
          '호오포노포노 공식 개회 기도 「나」는 「나」이다와 폐회 기도 「나」의 평화입니다.',
          '모든 의식 너머 텅 빈 공(空)의 순수함과 영원한 신성의 평화를 회복합니다.',
          '아침을 열 때 개회 기도를, 하루를 닫을 때 폐회 기도를 읊습니다.',
        ]}
        steps={[
          '「나」는 「나」이다 개회 기도로 하루를 시작하는 아침 루틴 짜줘',
          '「나」의 평화 폐회 기도로 잠들기 전 마음을 비우는 법 알려줘',
          '나의 자아와 평화 기도문에 담긴 참된 공(Zero)의 의미 설명해줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Food & Item Cleansing Tools · 13가지 음식 & 사물 정화 도구"
        icon={Droplets}
        principles={[
          '호오포노포노 핸드북에 수록된 13가지 음식 및 사물 정화 도구입니다.',
          '🍓 딸기(체중·외모 강박 정화), 🥞 팬케이크(상실·상처 치유), 🫐 블루베리(영적 전진), ☕ 핫초콜릿(물질 집착 해소), 🍨 바닐라 아이스크림(고요한 평화), 🍬 젤리빈(적재적소 조율), 🫧 풍선껌(지성주의 해방) 등.',
          '실제 음식을 섭취하거나 그 상징을 마음속으로 시각화하며 네 구절을 읊는 것만으로도 강력한 정화가 일어납니다.',
        ]}
        steps={[
          '13가지 음식 정화 도구의 원리와 실천 방법 알려줘',
          '체중과 외모 불안을 딸기 도구로 정화하는 3단계 실천법 안내해줘',
          '돈과 물질 집착을 핫초콜릿 도구로 정화하는 루틴 알려줘',
          '머리로만 따지는 지성주의를 풍선껌 도구로 날려버리는 상상법 알려줘',
        ]}
        {...sectionProps}
      />

      <BibleToolSection
        title="Daily Pono · 매일의 평화"
        icon={Sun}
        principles={[
          'Pono는 하와이어로 올바름, 균형, 평화를 뜻합니다.',
          '아침·낮·저녁 짧은 정화가 하루의 패턴을 바꿉니다.',
          '완벽하지 않아도 됩니다. 한 번의 네 구절도 충분합니다.',
        ]}
        steps={[
          '아침 5분 호오포노포노 루틴 짜줘',
          '잠들기 전 정화 명상 가이드 해줘',
          '오늘 하루를 평화(Pono)로 마무리하는 방법 알려줘',
        ]}
        {...sectionProps}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-sky-500/5 border border-sky-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-sky-500/20 flex items-center justify-center border border-sky-500/30 shadow-2xl relative z-10">
          <Heart className="w-8 h-8 text-sky-400" />
        </div>
        <div className="space-y-6 relative z-10">
          <h3 className="text-sm font-black text-sky-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">
            Ho&apos;oponopono Note
          </h3>
          <p className="text-xl md:text-xl text-sky-100 leading-relaxed font-sans max-w-3xl mx-auto drop-shadow-lg">
            &ldquo;문제는 밖에 없습니다. 정화할 기억은 내 안에 있습니다. 미안합니다, 용서하세요, 감사합니다, 사랑합니다.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};