/**
 * Utility for parsing and extracting 3~4 concise emotion & achievement tags from epilogue summaries.
 */

interface KeywordPattern {
  keyword: string;
  tag: string;
  category: 'emotion' | 'achievement' | 'state';
}

const DOMAIN_DEFAULT_TAGS: Record<string, string[]> = {
  orange: ['마음치유', '감정수용', '내면성찰'],
  trinity: ['운명나침반', '직관통찰', '우주흐름'],
  heal: ['생체활력', '호흡이완', '리듬회복'],
  bluebird: ['소리치유', '시적공감', '영혼안식'],
  muse: ['영감스파크', '창작발현', '예술적시선'],
};

const EMOTION_ACHIEVEMENT_KEYWORDS: KeywordPattern[] = [
  // 감정 (Emotions)
  { keyword: '안식', tag: '따뜻한안식', category: 'emotion' },
  { keyword: '평온', tag: '마음평온', category: 'emotion' },
  { keyword: '위로', tag: '다정한위로', category: 'emotion' },
  { keyword: '수용', tag: '감정수용', category: 'emotion' },
  { keyword: '인정', tag: '자신수용', category: 'emotion' },
  { keyword: '치유', tag: '마음치유', category: 'emotion' },
  { keyword: '쉼표', tag: '영혼의쉼표', category: 'emotion' },
  { keyword: '정화', tag: '맑은정화', category: 'emotion' },
  { keyword: '비움', tag: '생각비우기', category: 'emotion' },
  { keyword: '자유', tag: '내면자유', category: 'emotion' },
  { keyword: '용기', tag: '내면용기', category: 'emotion' },
  { keyword: '기쁨', tag: '창조의기쁨', category: 'emotion' },

  // 성과 및 실천 (Achievements)
  { keyword: '오라클', tag: '오라클탐색', category: 'achievement' },
  { keyword: '타로', tag: '운명리딩', category: 'achievement' },
  { keyword: '사주', tag: '사주기운조율', category: 'achievement' },
  { keyword: '직관', tag: '직관통찰', category: 'achievement' },
  { keyword: '중심', tag: '중심잡기', category: 'achievement' },
  { keyword: '창작', tag: '창작발현', category: 'achievement' },
  { keyword: '영감', tag: '영감스파크', category: 'achievement' },
  { keyword: '씨앗', tag: '아이디어씨앗', category: 'achievement' },
  { keyword: '표현', tag: '고유한표현', category: 'achievement' },
  { keyword: '성찰', tag: '내면성찰', category: 'achievement' },
  { keyword: '일기', tag: '감정기록', category: 'achievement' },
  { keyword: '호흡', tag: '호흡조율', category: 'achievement' },
  { keyword: '이완', tag: '신체이완', category: 'achievement' },
  { keyword: '활력', tag: '생체활력', category: 'achievement' },
  { keyword: '리듬', tag: '리듬회복', category: 'achievement' },
  { keyword: '소리', tag: '사운드힐링', category: 'achievement' },
  { keyword: '시적', tag: '시적감성', category: 'achievement' },
  { keyword: '공명', tag: '에너지공명', category: 'achievement' },
  { keyword: '조화', tag: '우주적조화', category: 'achievement' },
  { keyword: '방향', tag: '방향성확립', category: 'achievement' },
];

/**
 * Extracts 3~4 emotion/achievement tags and the clean body text from raw summary string.
 */
export function parseSummaryAndTags(
  rawSummary: string | undefined | null,
  appKey: string
): { tags: string[]; body: string } {
  if (!rawSummary || typeof rawSummary !== 'string') {
    const defaultTags = DOMAIN_DEFAULT_TAGS[appKey] || ['일상성찰', '마음정돈', '새로운에너지'];
    return { tags: defaultTags, body: '' };
  }

  const trimmed = rawSummary.trim();
  const explicitTags: string[] = [];
  const lines = trimmed.split('\n');

  // Check if first line or early part has hashtags (#태그)
  const hashtagRegex = /#([\p{L}\p{N}_]+)/gu;
  const firstLineMatches = lines[0]?.match(hashtagRegex);

  let cleanBody = trimmed;

  if (firstLineMatches && firstLineMatches.length >= 2) {
    firstLineMatches.forEach((m) => {
      const tagText = m.replace(/^#/, '').trim();
      if (tagText && !explicitTags.includes(tagText)) {
        explicitTags.push(tagText);
      }
    });
    // Remove the hashtag line from the body
    cleanBody = lines.slice(1).join('\n').trim();
  } else {
    // Check if there are hashtags at the end of the text
    const lastLineMatches = lines[lines.length - 1]?.match(hashtagRegex);
    if (lastLineMatches && lastLineMatches.length >= 2) {
      lastLineMatches.forEach((m) => {
        const tagText = m.replace(/^#/, '').trim();
        if (tagText && !explicitTags.includes(tagText)) {
          explicitTags.push(tagText);
        }
      });
      cleanBody = lines.slice(0, -1).join('\n').trim();
    }
  }

  // If explicit tags were found, ensure 3~4 tags
  if (explicitTags.length >= 3) {
    return {
      tags: explicitTags.slice(0, 4),
      body: cleanBody || trimmed,
    };
  }

  // Automatic semantic extraction from summary text
  const extractedTags: string[] = [...explicitTags];
  const lowerText = cleanBody.toLowerCase();

  for (const item of EMOTION_ACHIEVEMENT_KEYWORDS) {
    if (lowerText.includes(item.keyword.toLowerCase())) {
      if (!extractedTags.includes(item.tag)) {
        extractedTags.push(item.tag);
      }
      if (extractedTags.length >= 4) break;
    }
  }

  // Fill up with domain defaults if fewer than 3 tags found
  const fallbackPool = DOMAIN_DEFAULT_TAGS[appKey] || ['일상성찰', '마음정돈', '새로운에너지'];
  for (const fallback of fallbackPool) {
    if (extractedTags.length >= 3) break;
    if (!extractedTags.includes(fallback)) {
      extractedTags.push(fallback);
    }
  }

  return {
    tags: extractedTags.slice(0, 4),
    body: cleanBody,
  };
}
