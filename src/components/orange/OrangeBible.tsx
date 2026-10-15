import React from 'react';
import { 
  Sparkles, Zap, Flame, Rocket, Box, Cpu, Lightbulb, Combine, Scissors
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const OrangeBible: React.FC<{ onConsult: (text: string) => void }> = ({ onConsult }) => {
  return (
    <div className="space-y-12 py-6">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Alchemy Codex</h2>
        <p className="text-sm text-orange-400 uppercase tracking-[0.3em] font-bold">아이디어 창발과 연성을 위한 바이블</p>
      </div>

      <BibleToolSection 
        title="Divergent Thinking"
        subtitle="ORANGE Module"
        icon={Zap}
        principles={[
           "현실적인 한계를 잠시 꺼두고 황당한 연결을 환영합니다",
           "전혀 상관없는 두 가지 개념을 충돌시킬 때 폭발력이 생깁니다",
           "세상에 나쁜 아이디어는 없으며, 오직 덜 섞인 아이디어만 있습니다"
        ]}
        steps={[
          "나의 핵심 아이디어와 전혀 어울리지 않는 개념 3가지 섞어보기",
          "당장 실현 불가능할 정도로 극단적인 상상 펼쳐보기",
          "이 아이디어를 다른 행성에서 실행한다면 어떨까?"
        ]}
        color="border-orange-500/20"
        textColor="text-orange-400"
        bgColor="bg-orange-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Catalyst Refinement"
        subtitle="ORANGE Module"
        icon={Flame}
        principles={[
          "발산된 재료들을 뜨거운 온도에서 제련하고 다듬습니다",
          "핵심적인 차별점 하나만 남기며 불필요한 장식은 거둬냅니다",
          "이 아이디어가 해결하는 가장 날카로운 '단 하나의 문제'를 정의합니다"
        ]}
        steps={[
          "내 아이디어를 한 문장의 엘리베이터 피치로 요약해줘",
          "이 서비스에서 당장 빼버려도 되는 기능 3가지 찾아내기",
          "나의 타겟 고객이 겪는 가장 뼈아픈 고통과 연결하기"
        ]}
        color="border-orange-500/20"
        textColor="text-orange-400"
        bgColor="bg-orange-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Momentum Drive"
        subtitle="ORANGE Module"
        icon={Rocket}
        principles={[
          "완벽주의는 혁신의 적이며 실행은 가장 좋은 테스트입니다",
          "MVP를 가장 조악한 형태로 빠르게 내놓아 피드백을 수집합니다",
          "계획보다 학습의 속도를 높이세요"
        ]}
        steps={[
          "이번 주말에 당장 실행해볼 수 있는 프로토타입 형태 제안해줘",
          "비용을 전혀 들이지 않고 시장의 반응을 확인하는 방법",
          "완벽주의에 빠지지 않고 일단 발사하는 마인드셋"
        ]}
        color="border-orange-500/20"
        textColor="text-orange-400"
        bgColor="bg-orange-400"
        onSelectStep={onConsult}
      />

      
      <BibleToolSection 
        title="Cross-Pollination"
        subtitle="ORANGE Module"
        icon={Combine}
        principles={[
          "혁신은 서로 다른 분야의 지식이 교차하는 지점에서 발생합니다",
          "당연한 것을 낯설게 보고 다른 산업의 성공 공식을 훔쳐오세요",
          "경계는 존재하지 않으며 연결만 존재합니다"
        ]}
        steps={[
          "나의 산업과 전혀 무관한 분야의 트렌드 3개 융합하기",
          "어울리지 않는 단어의 결합으로 새로운 컨셉 도출하기",
          "기존의 상식을 파괴하는 발상의 전환 연습"
        ]}
        color="border-orange-500/20"
        textColor="text-orange-400"
        bgColor="bg-orange-400"
        onSelectStep={onConsult}
      />


      <BibleToolSection 
        title="Occam's Edge"
        subtitle="ORANGE Module"
        icon={Scissors}
        principles={[
          "기능의 추가가 아니라 본질만 남기는 것이 완성입니다",
          "설명이 필요한 제품은 이미 실패한 디자인입니다",
          "가장 단순하고 우아한 해결책을 찾을 때까지 덜어내세요"
        ]}
        steps={[
          "제품/아이디어에서 가장 사소한 기능 3가지 제거하기",
          "이 아이디어를 부트스트래핑 방식으로 검증하는 법",
          "사용자가 겪는 핵심 여정 단축시키기"
        ]}
        color="border-orange-500/20"
        textColor="text-orange-400"
        bgColor="bg-orange-400"
        onSelectStep={onConsult}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-orange-500/5 border border-orange-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-orange-500/20 flex items-center justify-center border border-orange-500/30 shadow-2xl relative z-10">
          <Lightbulb className="w-8 h-8 text-orange-400" />
        </div>
        <div className="space-y-6 relative z-10">
           <h3 className="text-sm font-black text-orange-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">Codex Note</h3>
           <p className="text-xl md:text-xl text-orange-100 leading-relaxed  font-sans max-w-3xl mx-auto drop-shadow-lg">
             "불꽃은 이미 당신 안에 피어났습니다. 이제 바람을 불어넣어 들불로 만들 차례입니다."
           </p>
        </div>
      </div>
    </div>
  );
};
