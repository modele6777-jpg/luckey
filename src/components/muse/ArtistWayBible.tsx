import React from 'react';
import { 
  Sun, MapPin, PenTool, Compass, BookOpen, Droplets, ShieldAlert, HeartCrack, Sparkles, Palette
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const ArtistWayBible: React.FC<{ 
  onConsult: (text: string) => void;
}> = ({ onConsult }) => {
  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-[10px] font-mono font-bold uppercase tracking-widest text-indigo-300">
          <Sparkles size={12} className="text-indigo-400" />
          <span>AI 코칭 &amp; 창조성 회복 질문 가이드</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Artist Bible</h2>
        <p className="text-sm text-indigo-400 uppercase tracking-[0.3em] font-bold">창조성 회복을 위한 바이블</p>
        <p className="text-xs text-white/45 max-w-2xl mx-auto leading-relaxed font-sans normal-case tracking-normal">
          줄리아 카메론의 『아티스트 웨이』를 바탕으로, 루시(AI)와 1:1 대화를 나누며 내면의 검열관을 잠재우고 창조성을 깨우는 코칭 가이드입니다.
        </p>

        
      </div>

      <BibleToolSection 
        title="Morning Pages"
        subtitle="MUSE Module"
        icon={PenTool}
        principles={[
           "검열하지 않고 매일 아침의 3페이지 글쓰기",
           "잘 쓰려고 하지 말고 의식의 흐름을 기록할 것",
           "이는 창조적 배출구이자 내면의 지혜를 점검하는 일"
        ]}
        steps={[
          "지금 바로 5분간의 의식의 흐름 적어보기",
          "내면 검열자의 목소리 적어보기",
          "오늘 아침의 감정 한 문장으로 정의하기"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Artist Date"
        subtitle="MUSE Module"
        icon={MapPin}
        principles={[
          "주 1회, 오직 아티스트(내면 아이)와 단둘이 보내는 시간",
          "작업이 아닌 '영감의 우물'을 채우는 활동",
          "현재에서 벗어나 새로운 공간으로 떠나는 자발적 모험"
        ]}
        steps={[
          "이번 주 아티스트 데이트 장소 추천받기",
          "현재서 할 수 있는 영감 활동 리스트",
          "최근에 간 가장 영감을 준 장소 공유하기"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Filling the Well"
        subtitle="MUSE Module"
        icon={Droplets}
        principles={[
          "창조성은 소모되는 것이 아니라 흘러감에서 시작됩니다",
          "지속적으로 영양분을 공급하지 않으면 영감의 우물은 마릅니다",
          "작업과 무관한 몰입을 통해 내면의 에너지를 충전하세요"
        ]}
        steps={[
          "지금 당장 우물을 채울 수 있는 소소한 활동 추천해주기",
          "나에게 영감을 주는 요소 리스트 작성하기",
          "오늘 하루, 작업 외에 우물만 채우는 구체적인 방법 알려주기"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Inner Critic"
        subtitle="MUSE Module"
        icon={ShieldAlert}
        principles={[
          "비평가는 당신의 적이 아니라 두려움의 목소리입니다",
          "그의 말은 사실이 아니라, 도전을 미루게 하는 방어 기제일 뿐입니다",
          "비평가를 객관화하고 그의 힘을 무력화하세요"
        ]}
        steps={[
          "내 안의 비평가에게 가상스러운 이름을 지어주고 길들이기",
          "비평가가 하는 부정적인 말을 논리적으로 반박해보기",
          "결과에 상관없이 시도하는 용기를 얻는 법 상담하기"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Creative Injuries"
        subtitle="MUSE Module"
        icon={HeartCrack}
        principles={[
          "과거의 비난과 조롱으로 인해 고착된 고통의 기억을 치유하세요",
          "그 상처는 당신의 재능 부족이 아니라, 성부의 편견일 뿐입니다",
          "상처받은 어린 아티스트를 위로하고 다시 시작할 용기를 얻으세요"
        ]}
        steps={[
          "예전에 창작을 방해받은 아픈 기억들을 털어놓고 치유하기",
          "상처받은 과거의 나에게 보내는 위로의 메시지 작성하기",
          "남의 평가에 시달리는 나에게 자유를 주는 명상 연습하기"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Taming Censor & Affirmations · 검열관 길들이기와 확언"
        subtitle="MUSE Module"
        icon={Sparkles}
        principles={[
          "내면 검열관(The Censor)의 비난은 진실이 아니라 두려움의 허상일 뿐입니다.",
          "검열관에게 우스꽝스러운 이름을 붙이고 미소 지으며 창작을 계속하세요.",
          "‘나는 신성한 창조적 통로다’라는 긍정 확언으로 잠재의식을 깨우세요."
        ]}
        steps={[
          "내 안의 검열관 목소리를 기록하고 반박하는 법 알려줘",
          "창작 두려움을 날려버리는 아티스트 긍정 확언 5개 추천해줘",
          "완벽주의를 내려놓고 10분 만에 낙서하듯 시작하는 법 알려줘"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Synchronicity & Sacred Play · 동시성과 성스러운 놀이"
        subtitle="MUSE Module"
        icon={Palette}
        principles={[
          "도약하라, 그러면 우주의 그물이 나타날 것입니다 (Leap, and the net will appear).",
          "걸작을 만들려는 강박을 버리고, 어린아이처럼 서툰 낙서와 놀이를 즐기세요.",
          "내가 작은 한 걸음을 뗄 때 온 우주가 문을 열고 영감을 채워줍니다."
        ]}
        steps={[
          "오늘 바로 시도할 수 있는 5분 성스러운 낙서/놀이 활동 알려줘",
          "창조적 동시성을 일상에서 체험하는 비결 설명해줘",
          "나만의 아티스트 데이트 아이디어 10가지 추천해줘"
        ]}
        color="border-indigo-500/20"
        textColor="text-indigo-400"
        bgColor="bg-indigo-400"
        onSelectStep={onConsult}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-indigo-500/5 border border-indigo-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 shadow-2xl relative z-10">
          <BookOpen className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="space-y-6 relative z-10">
           <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">Bible Note</h3>
           <p className="text-xl md:text-xl text-indigo-100 leading-relaxed  font-sans max-w-3xl mx-auto drop-shadow-lg">
             "창조성은 배우는 것이 아니라 회복하는 것이다. 당신 안에 이미 금광이 있다."
           </p>
        </div>
      </div>
    </div>
  );
};

