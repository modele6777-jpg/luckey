import React from 'react';
import { 
  LucideStars, Eye, Compass, Moon, Sun, Eclipse, Infinity, Map, Sparkle
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const TrinityBible: React.FC<{ onConsult: (text: string) => void }> = ({ onConsult }) => {
  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Cosmic Manuscript</h2>
        <p className="text-sm text-yellow-400 uppercase tracking-[0.3em] font-bold">우주적 정렬과 운명을 위한 바이블</p>
      </div>

      <BibleToolSection 
        title="Synchro-Alignment"
        subtitle="TRINITY Module"
        icon={Eclipse}
        principles={[
           "우주는 우연을 가장하여 당신에게 메시지를 보냅니다",
           "반복되는 숫자, 기시감, 우연한 만남은 올바른 궤도에 있다는 증거입니다",
           "자신의 직관을 믿고 파동의 흐름에 저항하지 마세요"
        ]}
        steps={[
          "최근 내가 겪은 우연한 일들의 숨겨진 의미 해독하기",
          "우주의 주파수와 나의 파동을 동기화하는 명상법",
          "선택의 기로에서 직관의 소리를 분별하는 법"
        ]}
        color="border-yellow-500/20"
        textColor="text-yellow-400"
        bgColor="bg-yellow-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Karmic Cycles"
        subtitle="TRINITY Module"
        icon={Infinity}
        principles={[
          "모든 원인은 결과를 낳고, 당신의 현재는 과거 선택들의 궤적입니다",
          "지루하게 반복되는 굴레를 깰 때 비로소 다음 차원의 문이 열립니다",
          "집착을 버리고 스스로 카르마의 사슬을 끊으세요"
        ]}
        steps={[
          "나의 삶에서 계속 반복되는 문제의 근원 찾기",
          "오랜 관계에서 얽힌 카르마 풀기",
          "과거의 후회를 용서하고 새로운 운명을 개척하는 조언"
        ]}
        color="border-yellow-500/20"
        textColor="text-yellow-400"
        bgColor="bg-yellow-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Cosmic Timing"
        subtitle="TRINITY Module"
        icon={Sun}
        principles={[
          "만물에는 고유의 때가 있으며 억지로 앞당길 수 없습니다",
          "정체기는 멈춤이 아니라 봄을 준비하는 겨울의 응축입니다",
          "기다림의 지혜를 발휘하고 때가 왔을 때 전력 질주하세요"
        ]}
        steps={[
          "지금 나는 운명의 사계절 중 어느 시기에 있는가?",
          "초조함을 다스리고 우주의 타이밍을 온전히 신뢰하는 방법",
          "나침반이 흔들릴 때 변하지 않는 북극성을 찾는 안내"
        ]}
        color="border-yellow-500/20"
        textColor="text-yellow-400"
        bgColor="bg-yellow-400"
        onSelectStep={onConsult}
      />

      
      <BibleToolSection 
        title="Soul Contract"
        subtitle="TRINITY Module"
        icon={Map}
        principles={[
          "당신은 지구에 오기 전, 배워야 할 교훈을 미리 선택했습니다",
          "현재 겪고 있는 시련은 계약서에 명시된 성장통일 뿐입니다",
          "저항 대신 영혼이 약속한 여정을 기꺼이 수용하세요"
        ]}
        steps={[
          "나의 영혼이 이번 생에서 완수해야 할 숙제 찾기",
          "지루한 시련 속에 숨겨진 영적 교훈 이해하기",
          "스스로 한계를 설정하는 에고의 착각 부수기"
        ]}
        color="border-yellow-500/20"
        textColor="text-yellow-400"
        bgColor="bg-yellow-400"
        onSelectStep={onConsult}
      />


      <BibleToolSection 
        title="Manifestation"
        subtitle="TRINITY Module"
        icon={Sparkle}
        principles={[
          "생각은 에너지를 모으고, 행동은 물질을 현실로 이끕니다",
          "결핍에 집중하면 결핍을, 풍요에 집중하면 풍요를 끌어당깁니다",
          "우주에게 명확하게 요청하고 조급함을 버리세요"
        ]}
        steps={[
          "우주에 전송하고 싶은 명확한 소망의 선언서 작성",
          "내면에 숨어있는 무의식적 결핍의 두려움 해소",
          "원하는 것이 이미 이루어졌다고 믿는 파동 조율법"
        ]}
        color="border-yellow-500/20"
        textColor="text-yellow-400"
        bgColor="bg-yellow-400"
        onSelectStep={onConsult}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-yellow-500/5 border border-yellow-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-yellow-500/20 flex items-center justify-center border border-yellow-500/30 shadow-2xl relative z-10">
          <LucideStars className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="space-y-6 relative z-10">
           <h3 className="text-sm font-black text-yellow-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">Trinity Note</h3>
           <p className="text-xl md:text-xl text-yellow-100 leading-relaxed  font-sans max-w-3xl mx-auto drop-shadow-lg">
             "모든 별자리는 당신의 탄생을 축복하며 빛났습니다. 우주가 이끄는 여정에 몸을 맡기세요."
           </p>
        </div>
      </div>
    </div>
  );
};
