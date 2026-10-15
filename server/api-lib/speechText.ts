/**
 * Advanced Korean & Multilingual Speech Text Normalizer
 * Designed specifically for high-naturalness Neural TTS (EdgeTTS SunHi/InJoon, Gemini, WebSpeech)
 * Features:
 *  1. Accurate rising question mark (?) prosody handling & detection
 *  2. Elimination of awkward TTS glitches (stuttering '...', trailing tildes '~', 'ㅎㅎ/ㅋㅋ/ㅠㅠ')
 *  3. Natural clause & sentence breathing pauses (, and .)
 *  4. Markdown/Symbol/Unit/Acronym phonetization for smooth listening
 */

export function prepareNaturalSpeechText(text: string): string {
  if (!text) return "";
  let clean = String(text);

  // 1. Remove URLs
  clean = clean.replace(/https?:\/\/\S+/gi, "");

  // 2. Remove system & media directives
  clean = clean.replace(/\[(?:YOUTUBE|EMOTION|TOOL|IMAGE|PROMPT|STAGE|SOUL_UPDATE|CARD_DRAWN|SYSTEM):[\s\S]*?\]/gi, "");

  // 3. Strip raw markdown links [Anchor](url) -> Anchor
  clean = clean.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 4. Remove all emojis, pictographs, special symbols, and surrogate pairs
  try {
    clean = clean.replace(/\p{Extended_Pictographic}/gu, " ");
  } catch (_) {
    clean = clean.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}]/gu, " ");
  }
  clean = clean.replace(/[★☆✦✧♠♣♥♦✿❀❁❂▲▼▶◀►◄◈◇◆●○■□✔✓✗✘※]/g, " ");

  // 5. Remove laugh/cry/chatter particles
  clean = clean.replace(/[ㅋㅎㅠㅜ]{1,}/g, " ");
  clean = clean.replace(/[ㄱ-ㅎ]{2,}/g, " ");

  // 6. Common English acronyms & technical terms phonetic smoothing for Korean TTS
  clean = clean
    .replace(/\bAI\b/gi, "에이아이")
    .replace(/\bPRO\b/gi, "프로")
    .replace(/\bTTS\b/gi, "음성")
    .replace(/\bSTT\b/gi, "음성인식")
    .replace(/\bUI\b/gi, "유아이")
    .replace(/\bUX\b/gi, "유엑스")
    .replace(/\bBGM\b/gi, "배경음악")
    .replace(/\bGPS\b/gi, "지피에스")
    .replace(/\bPDF\b/gi, "피디에프")
    .replace(/\bDNA\b/gi, "디엔에이")
    .replace(/\bMBTI\b/gi, "엠비티아이")
    .replace(/\bOK\b/gi, "오케이")
    .replace(/\bvs\b/gi, "대")
    .replace(/\bVS\b/gi, "대")
    .replace(/\bNo\.?\s*(\d+)/gi, "넘버 $1");

  // 7. Mathematical & special unit symbols
  clean = clean
    .replace(/(\d+)\s*%/g, "$1퍼센트")
    .replace(/(\d+)\s*~\s*(\d+)/g, "$1에서 $2")
    .replace(/([가-힣a-zA-Z0-9])\s*·\s*([가-힣a-zA-Z0-9])/g, "$1, $2")
    .replace(/([가-힣a-zA-Z0-9])\s*\+\s*([가-힣a-zA-Z0-9])/g, "$1, 그리고 $2")
    .replace(/([가-힣a-zA-Z0-9])\s*&\s*([가-힣a-zA-Z0-9])/g, "$1 그리고 $2")
    .replace(/([가-힣a-zA-Z0-9])\s*[\/／]\s*([가-힣a-zA-Z0-9])/g, "$1, 또는 $2")
    .replace(/([가-힣a-zA-Z0-9])\s*->\s*([가-힣a-zA-Z0-9])/g, "$1에서 $2로")
    .replace(/([가-힣a-zA-Z0-9])\s*=>\s*([가-힣a-zA-Z0-9])/g, "$1, 따라서 $2");

  // 8. Parentheses & Brackets handling
  const bracketRegexList = [
    /\(([^()]*)\)/g,
    /（([^（）]*)）/g,
    /\[([^\[\]]*)\]/g,
    /［([^［］]*)］/g,
    /\{([^{}]*)\}/g,
    /｛([^｛｝]*)｝/g,
    /【([^【】]*)】/g,
    /<([^<>]*)>/g,
    /《([^《》]*)》/g,
    /〈([^〈〉]*)〉/g,
    /「([^「」]*)」/g,
    /『([^『』]*)』/g,
  ];

  for (let pass = 0; pass < 3; pass++) {
    for (const regex of bracketRegexList) {
      clean = clean.replace(regex, (_match, inner) => {
        const trimmed = (inner || '').trim();
        if (/[가-힣a-zA-Z0-9]/.test(trimmed)) {
          return `, ${trimmed}, `;
        }
        return " ";
      });
    }
  }

  // 9. Remove HTML tags and entities
  clean = clean
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/&ldquo;|&rdquo;|&quot;|&apos;/gi, "")
    .replace(/&lt;|&gt;|&amp;/gi, " ");

  // 10. Clean quotes and stray markdown formatting symbols
  clean = clean
    .replace(/["'`“”‘’]/g, "")
    .replace(/~~/g, "")
    .replace(/==/g, "");

  // 11. Convert numbered list headers
  clean = clean.replace(/(?:^|\n)\s*1\.\s+/g, "\n첫째, ");
  clean = clean.replace(/(?:^|\n)\s*2\.\s+/g, "\n둘째, ");
  clean = clean.replace(/(?:^|\n)\s*3\.\s+/g, "\n셋째, ");
  clean = clean.replace(/(?:^|\n)\s*4\.\s+/g, "\n넷째, ");
  clean = clean.replace(/(?:^|\n)\s*5\.\s+/g, "\n다섯째, ");
  clean = clean.replace(/(?:^|\n)\s*(\d+)\.\s+/g, "\n$1번, ");

  // 12. Markdown headers & bold titles
  clean = clean.replace(/^#{1,6}\s*(.+)$/gm, (_m, title) => {
    let t = String(title || '').replace(/[*#_~`>|\\]/g, " ").trim();
    if (!t) return "";
    const isQuestion = /\?$/.test(t) || /(?:인가요|일까요|할까요|될까요|있을까요|없을까요|어떨까요|아닐까요|맞나요|하나요)\s*$/.test(t);
    t = t.replace(/[.!?…,;:~]+$/, "").trim();
    return isQuestion ? `${t}? \n\n` : `${t}. \n\n`;
  });

  clean = clean.replace(/(?:^|\n)\s*\*\*(.+?)\*\*\s*(?::|-)?\s*/gm, (_m, boldText) => {
    let b = String(boldText || '').replace(/[*#_~`>|\\]/g, " ").trim();
    if (!b) return "";
    const isQuestion = /\?$/.test(b) || /(?:인가요|일까요|할까요|될까요|있을까요|없을까요|어떨까요|아닐까요|맞나요|하나요)\s*$/.test(b);
    b = b.replace(/[.!?…,;:~]+$/, "").trim();
    return isQuestion ? `\n${b}? \n` : `\n${b}. \n`;
  });

  clean = clean.replace(/(?:^|\n)\s*([가-힣a-zA-Z0-9\s]{2,15})\s*:\s*/gm, (_m, label) => {
    const trimmed = label.trim();
    if (trimmed.length > 0 && trimmed.length <= 15) {
      return `\n${trimmed}, `;
    }
    return `\n${label}, `;
  });

  // 13. Structure lines and paragraphs
  const paragraphs = clean.split(/\r?\n\s*\r?\n+/);
  const formattedParagraphs: string[] = [];

  for (const para of paragraphs) {
    const lines = para.split(/\r?\n+/);
    const formattedLines: string[] = [];

    for (const rawLine of lines) {
      let line = rawLine
        .replace(/[*#_~`>|\\]/g, " ")
        .replace(/[-=]{2,}/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      if (!line) continue;

      line = line.replace(/^[-*•]\s+/, "");
      line = line.replace(/~+$/, ".");
      line = line.replace(/[!]{2,}/g, "!");
      line = line.replace(/[\?]{2,}/g, "?");
      line = line.replace(/\?[\s!.]+/g, "? ");
      line = line.replace(/![\s?.]+/g, "! ");

      if (!/[?!]$/.test(line)) {
        const questionEndingPattern = /(?:인가요|일까요|할까요|될까요|있을까요|없을까요|어떨까요|아닐까요|맞나요|하나요|어떠세요|어떠신가요|느껴지나요|보이나요|생각하나요|해볼까요|갈까요|볼까요|알까요|했을까요|있을지|없을지|일지|할지|어때요|볼래요|할래요|있나요|없나요)[.\s]*$/;
        if (questionEndingPattern.test(line)) {
          line = line.replace(/[.\s]+$/, "") + "?";
        } else if (!/[.!,;:]$/.test(line)) {
          line += ".";
        }
      }

      formattedLines.push(line);
    }

    if (formattedLines.length > 0) {
      formattedParagraphs.push(formattedLines.join(" "));
    }
  }

  let result = formattedParagraphs.join(" ");

  // 14. Precision punctuation smoothing
  result = result
    .replace(/\s*\?\s*/g, "? ")
    .replace(/\?\s*[.,!~]+/g, "? ")
    .replace(/[.,~]+\s*\?/g, "? ")
    .replace(/\s*!\s*/g, "! ")
    .replace(/!\s*[.,~]+/g, "! ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s*\.\s*/g, ". ")
    .replace(/,\s*,+/g, ", ")
    .replace(/\.\s*\.+/g, ". ")
    .replace(/,\s*\./g, ". ")
    .replace(/\.\s*,/g, ". ")
    .replace(/~\s*/g, " ")
    .replace(/\.{2,}/g, ". ")
    .replace(/\s+/g, " ")
    .trim();

  return result;
}
