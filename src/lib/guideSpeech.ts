import { normalizeTextForSpeech, playTTS } from '@/utils/tts';

export type GuideSpeechBlock = {
  label: string;
  items: { title: string; body: string }[];
};

export type GuideSpeechSection = {
  name: string;
  subtitle: string;
  description: string;
  steps: string[];
  tip: string;
  blocks?: GuideSpeechBlock[];
};

const GUIDE_VOICE = 'Kore';

export function buildGuideSectionSpeech(section: GuideSpeechSection): string {
  const steps = section.steps
    .map((step, index) => `${index + 1}번째, ${step}`)
    .join(' ... ');

  const blocks = section.blocks
    ?.map(
      (block) =>
        `${block.label}. ... ${block.items.map((item) => `${item.title}. ... ${item.body}`).join(' ... ')}`,
    )
    .join(' ... \n\n');

  return [
    section.name,
    section.subtitle,
    section.description,
    blocks,
    '이렇게 시작하세요.',
    steps,
    'PRISM 활용 팁.',
    section.tip,
  ]
    .filter(Boolean)
    .join(' ... \n\n');
}

export function getGuideSectionSpeechKey(section: GuideSpeechSection): string {
  return normalizeTextForSpeech(buildGuideSectionSpeech(section));
}

export async function playGuideSection(section: GuideSpeechSection): Promise<void> {
  await playTTS(buildGuideSectionSpeech(section), GUIDE_VOICE, false);
}