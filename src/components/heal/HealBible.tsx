import React from 'react';
import { 
  Activity, Wind, Brain, Sun, HeartPulse, Droplets, BookOpen, Library
} from 'lucide-react';
import { BibleToolSection } from '../BibleToolSection';

export const HealBible: React.FC<{ onConsult: (text: string) => void }> = ({ onConsult }) => {
  return (
    <div className="space-y-12 py-6 overflow-y-auto no-scrollbar">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tighter">Mind & Body Codex</h2>
        <p className="text-sm text-emerald-400 uppercase tracking-[0.3em] font-bold">정신 건강 서적 및 내면의 평화를 위한 바이블</p>
      </div>

      <BibleToolSection 
        title="Mindful Breathing"
        subtitle="STRESS MANAGEMENT"
        icon={Wind}
        principles={[
           "호흡은 몸과 마음을 잇는 가장 강력한 닻입니다",
           "스트레스 요인에 즉각 반응하지 않고 공간을 두는 연습이 필요합니다",
           "「호흡의 기술 (제임스 네스터 저)」 - 잃어버린 호흡을 찾는 치유의 기록"
        ]}
        steps={[
          "스트레스가 너무 심할 때 스스로를 달래는 4-7-8 호흡법 가이드",
          "호흡의 기술 책에서 제안하는 궁극의 휴식법 알려줘",
          "지금 당장 긴장을 풀어주는 3분 호흡 명상 시작하기"
        ]}
        color="border-emerald-500/20"
        textColor="text-emerald-400"
        bgColor="bg-emerald-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Cognitive Resilience"
        subtitle="PSYCHOLOGICAL HEALTH"
        icon={Brain}
        principles={[
          "우리를 괴롭히는 것은 상황 자체가 아니라 상황에 대한 우리의 해석입니다",
          "행동 뒤에 숨은 우울감과 불안감을 인지행동적으로 분해하세요",
          "「우울할 땐 뇌과학 (앨릭스 코브 저)」 - 뇌과학이 알려주는 우울증 탈출법"
        ]}
        steps={[
          "우울할 땐 뇌과학에서 말하는 하강나선 끊어내기 실천법",
          "나의 불안한 감정을 객관적인 사실과 분리하는 연습",
          "요즘 무기력한데 뇌를 속여서라도 활력을 얻는 작은 행동법"
        ]}
        color="border-emerald-500/20"
        textColor="text-emerald-400"
        bgColor="bg-emerald-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Dopamine Detox"
        subtitle="MODERN WELLNESS"
        icon={Library}
        principles={[
          "넘쳐나는 자극은 우리의 보상 회로를 파괴합니다",
          "고통과 쾌락은 같은 뇌 부위에서 처리되며, 균형을 찾아야 합니다",
          "「도파민네이션 (애나 렘키 저)」 - 쾌락 과잉 시대에서 균형 찾기"
        ]}
        steps={[
          "도파민네이션에서 제시하는 30일 스마트폰 디톡스 방법칙",
          "도파민 중독 자가진단 및 건강한 보상 체계 다시 세우기",
          "숏폼에빼앗긴 나의 집중력과 내면의 고요함 되찾는 법"
        ]}
        color="border-emerald-500/20"
        textColor="text-emerald-400"
        bgColor="bg-emerald-400"
        onSelectStep={onConsult}
      />

      <BibleToolSection 
        title="Trauma & Healing"
        subtitle="DEEP RECOVERY"
        icon={HeartPulse}
        principles={[
          "몸은 모든 트라우마와 감정적 상처를 기억하고 있습니다",
          "트라우마의 치유는 머리가 아닌 몸과 신경계에서 시작됩니다",
          "「몸은 기억한다 (베셀 반 데어 콜크 저)」 - 트라우마가 남긴 흉터 치유"
        ]}
        steps={[
          "몸은 기억한다에서 말하는 트라우마 극복의 첫 신경계 안정화 방법",
          "이유 없이 몸이 굳거나 긴장될 때 소마틱스(Somatics) 기법 알아보기",
          "오래된 상처로부터 나를 안전하게 지키고 안도감을 리셋하는 법"
        ]}
        color="border-emerald-500/20"
        textColor="text-emerald-400"
        bgColor="bg-emerald-400"
        onSelectStep={onConsult}
      />
      
      <BibleToolSection 
        title="Subtle Art of Living"
        subtitle="EMOTIONAL BALANCE"
        icon={Droplets}
        principles={[
          "모든 것을 신경 쓰기에는 우리의 에너지가 너무 제한적입니다",
          "가장 중요한 핵심 가치 외의 것들에는 과감히 무심해지세요",
          "「신경 끄기의 기술 (마크 맨슨 저)」 - 인생의 무거운 짐 내려놓기"
        ]}
        steps={[
          "신경 끄기의 기술에서 설명하는 '나쁜 가치'와 '좋은 가치' 판별법",
          "타인의 기대에 억눌려 낭비되는 나의 감정 에너지 차단하기",
          "진짜 나에게 의미 있는 소수의 문제들에만 집중하는 마인드셋"
        ]}
        color="border-emerald-500/20"
        textColor="text-emerald-400"
        bgColor="bg-emerald-400"
        onSelectStep={onConsult}
      />

      <div className="mt-12 p-8 rounded-[36px] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center space-y-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="w-16 h-16 rounded-[24px] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 shadow-2xl relative z-10">
          <BookOpen className="w-8 h-8 text-emerald-400" />
        </div>
        <div className="space-y-6 relative z-10">
           <h3 className="text-sm font-black text-emerald-400 uppercase tracking-[0.3em] opacity-90 drop-shadow-md">Bibliotherapy Note</h3>
           <p className="text-xl md:text-xl text-emerald-100 leading-relaxed font-sans max-w-3xl mx-auto drop-shadow-lg">
             "때로는 가장 좋은 처방전은 한 권의 책 안에 있습니다. 수많은 전문가들의 지혜를 당신의 내면에 천천히 스며들게 하세요."
           </p>
        </div>
      </div>
    </div>
  );
};
