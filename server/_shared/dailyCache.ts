export function getTodayDateKey(): string {
  const d = new Date();
  return d.toLocaleDateString("sv");
}

export function getDateSeed(salt = ""): number {
  const key = `${getTodayDateKey()}${salt}`;
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}