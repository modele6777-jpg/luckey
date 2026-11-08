export interface ChatTargetProfile {
  id: string;
  name: string;
  nickname?: string;
  isMe?: boolean;
  birthdate: string; // YYYY-MM-DD
  birthtime?: string; // HH:MM
  gender: 'male' | 'female' | 'other';
  birthCity?: string; // 출생지 (예: 서울, 부산, 대구 등)
  lunarSolar?: 'solar' | 'lunar';
  isLeapMonth?: boolean;
  relationship?: string; // 관계 태그 (본인, 연인, 썸, 친구, 동업자, 가족, 동료 등)
}
