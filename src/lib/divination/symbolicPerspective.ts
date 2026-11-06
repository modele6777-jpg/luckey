/** Only qualitative advice is eligible for symbolic synthesis; never pass raw scores. */
export function getSymbolicPerspective(value: unknown): string[] {
  const views = new Set<string>();
  const meaningful = /advice|recommend|wisdom|theme|reflect|affirm|message|interpret|meaning|guid|insight|description|note|summary|tip|practice|ritual|action|strategy|focus|virtue|lesson|counsel|teaching|suggest|mantra|exercise|keyword/i;
  function visit(node: unknown, eligible = false): void {
    if (typeof node === 'string') {
      const text = node.trim();
      if (eligible && text && !/[0-9%％]|점\s*\/|확률|진단율|방패율|지수\s*[:：]/.test(text)) views.add(text);
    } else if (Array.isArray(node)) {
      node.forEach(child => visit(child, eligible));
    } else if (node && typeof node === 'object') {
      for (const [key, child] of Object.entries(node)) visit(child, eligible || meaningful.test(key));
    }
  }
  visit(value);
  return [...views];
}
