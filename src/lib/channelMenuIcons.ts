import { MessageCircle, KeyRound, Sun, TreeDeciduous, Sparkles, Activity, Bird, Music, Moon, createLucideIcon } from 'lucide-react';

/** 일반 루시 말풍선: 말풍선 안에 − (lucide에는 minus 버전이 없어 같은 외곽선으로 만든다). 루시 플러스는 MessageCirclePlus. */
export const MessageCircleMinus = createLucideIcon('message-circle-minus', [
  ['path', { d: 'M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719', key: 'bubble' }],
  ['path', { d: 'M8 12h8', key: 'minus' }],
]);

/** Shared by the sidebar and Big Bang destination feedback. */
export const CHANNEL_MENU_ICONS = {
  lucy: MessageCircle, key: KeyRound,
  prologue: Sun, orange: TreeDeciduous, trinity: Sparkles,
  heal: Activity, bluebird: Bird, muse: Music, epilogue: Moon,
};

export function getDestinationChannel(path: string) {
  const pathname = path.split(/[?#]/)[0];
  const aliases: Record<string, keyof typeof CHANNEL_MENU_ICONS> = {
    '/': 'lucy', '/chat': 'lucy', '/lucy': 'lucy',
    '/key': 'key', '/calm': 'key', '/orb': 'key', '/gateway': 'key', '/crystal': 'key', '/pharmacy': 'key',
    '/profile': 'epilogue', '/chronicle': 'epilogue',
    '/ecpr': 'prologue', '/todo': 'prologue', '/universe': 'prologue',
  };
  const id = aliases[pathname] || pathname.slice(1) as keyof typeof CHANNEL_MENU_ICONS;
  return { id, icon: CHANNEL_MENU_ICONS[id] || Sparkles };
}
