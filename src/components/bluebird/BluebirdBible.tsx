import React from 'react';
import { 
  Wind, Heart, Moon, Feather, BookOpen, Layers, ShieldCheck, Scale, Compass
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const BluebirdBible: React.FC<{ onConsult: (text: string) => void }> = ({ onConsult }) => {
  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Bluebird's Path</h2>
        <p className="text-sm text-sky-400 uppercase tracking-[0.3em] font-bold">평온과 수용을 위한 바이블</p>
      </div>

      <BibleToolSection 
        title="Mindful Breathing"
        subtitle="BLUEBIRD Module"
        icon={Wind}
        principles={[
           "호흡은 현재에 머무르는 가장 확실한 닻입니다",
           "과도한 생각의 굴레에서 벗어나 신체의 감각에 편안히 안주합니다",
           "평화는 무언가를 찾는 것이 아니라 불필요한 것을 내려놓는 것입니다"
        ]}
        steps={[
          "마음을 다스리는 3분 호흡법 알려줘",
          "불안이 밀려올 때 할 수 있는 비상 호흡법",
          "지금 복잡한 이 마음을 호흡으로 어떻게 비울까?"
        ]}
        color="border-sky-500/20"
        textColor="text-sky-400"
        bgColor="bg-sky-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Emotional Alchemy"
        subtitle="BLUEBIRD Module"
        icon={Heart}
        principles={[
          "감정은 나 자신이 아니며 통과해가는 파도일 뿐입니다",
          "부정적인 감정에 저항하지 않고 그대로 관찰하며 허용합니다",
          "판단을 멈출 때 고통은 단순한 감각이 되어 흩어집니다"
        ]}
        steps={[
          "오늘 나를 힘들게 한 이 감정을 어떻게 바라볼까?",
          "저항 없이 감정을 흘려보내는 명상 방법",
          "스스로를 비난하는 마음 멈추기"
        ]}
        color="border-sky-500/20"
        textColor="text-sky-400"
        bgColor="bg-sky-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Radical Acceptance"
        subtitle="BLUEBIRD Module"
        icon={ShieldCheck}
        principles={[
          "일어난 일은 일어난 일이며, 우리는 그것을 싸울 필요가 없습니다",
          "바꿀 수 없는 것을 온전히 받아들일 때 진정한 자유가 시작됩니다",
          "수용은 포기가 아니라 현실에 대한 완전한 동의입니다"
        ]}
        steps={[
          "내가 바꿀 수 없는 상황을 받아들이는 마음가짐",
          "후회되는 과거의 일로부터 나를 놓아주기",
          "통제하려는 집착을 내려놓는 방법"
        ]}
        color="border-sky-500/20"
        textColor="text-sky-400"
        bgColor="bg-sky-400"
        onSelectStep={onConsult}
      />

      
      <BibleToolSection 
        title="Mindful Detachment"
        subtitle="BLUEBIRD Module"
        icon={Compass}
        principles={[
          "생각은 파도와 같아 억누르면 더 크게 몰려옵니다",
          "나라는 존재와 내가 하는 생각을 분리하여 관찰하세요",
          "집착을 내려놓아야 비로소 새로운 흐름이 들어옵니다"
        ]}
        steps={[
          "머릿속을 가득 채운 부정적인 생각을 강물에 띄워 보내기",
          "거리두기 명상을 통해 현실 감각 되찾기",
          "타인의 평가로부터 자유로워지는 마음 챙김"
        ]}
        color="border-sky-500/20"
        textColor="text-sky-400"
        bgColor="bg-sky-400"
        onSelectStep={onConsult}
      />


      <BibleToolSection 
        title="Equanimity"
        subtitle="BLUEBIRD Module"
        icon={Scale}
        principles={[
          "모든 것은 변하며, 변한다는 사실만이 영원합니다",
          "좋은 일에 지나치게 들뜨지 않고, 나쁜 일에 완전히 무너지지 않기",
          "중심을 잡고 내면의 호수처럼 평온함을 유지하세요"
        ]}
        steps={[
          "감정의 기복을 다스리는 평정심 훈련",
          "나침반이 흔들리지 않게 마음의 중심 잡는 법",
          "일방적인 생각의 치우침 교정하기"
        ]}
        color="border-sky-500/20"
        textColor="text-sky-400"
        bgColor="bg-sky-400"
        onSelectStep={onConsult}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-sky-500/5 border border-sky-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-sky-500/20 flex items-center justify-center border border-sky-500/30 shadow-2xl relative z-10">
          <Feather className="w-8 h-8 text-sky-400" />
        </div>
        <div className="space-y-6 relative z-10">
           <h3 className="text-sm font-black text-sky-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">Bible Note</h3>
           <p className="text-xl md:text-xl text-sky-100 leading-relaxed  font-sans max-w-3xl mx-auto drop-shadow-lg">
             "당신의 영혼은 이미 온전합니다. 폭풍우 속에서도 하늘이 그 푸르름을 잃지 않는 것처럼."
           </p>
        </div>
      </div>
    </div>
  );
};
