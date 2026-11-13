/** Only qualitative, non-attributed advice is eligible for symbolic synthesis; never pass raw scores or unverified quotations. */
export function getSymbolicPerspective(value: unknown): string[] {
  const views = new Set<string>();
  const meaningful = /advice|recommend|guid|tip|practice|ritual|action|strategy|focus|counsel|suggest|exercise|nextstep/i;
  const excludedKey = /quote|aphorism|source|citation|reference|bibliography|author|attribution|score|index|metric|measurement|confidence|probability|percent|summary|description|interpretation|insight|meaning|wisdom|theme|message|note|virtue|lesson|teaching|mantra|keyword/i;
  const citationLike = /["“‘「『《].+?["”’」』》]|원전|원문|직접\s*인용|불후의\s*(?:명언|명구|잠언)|명언|명구|출처\s*:/is;

  function visit(node: unknown, eligible = false): void {
    if (typeof node === 'string') {
      const text = node.trim();
      if (eligible && text && !/[0-9%％]|점\s*\/|확률|진단율|방패율|지수\s*[:：]/.test(text) && !citationLike.test(text)) {
        views.add(text);
      }
    } else if (Array.isArray(node)) {
      node.forEach(child => visit(child, eligible));
    } else if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) {
        if (excludedKey.test(key)) continue;
        visit(child, eligible || meaningful.test(key));
      }
    }
  }

  visit(value);
  return [...views];
}
