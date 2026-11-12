import { MessageCircle, KeyRound, Sun, TreeDeciduous, Sparkles, Activity, Bird, Music, Moon } from 'lucide-react';

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
