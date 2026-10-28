/** Rank installed voices without changing their natural pitch. */
export function scoreSpeechVoice(voice: { name: string }): number {
  const name = voice.name.toLowerCase();
  const female = /female|여성|sunhi|heami|yuna|narae|seoyeon|sohee|jiwon|siri|aoede|\bkore\b|clara|aria|zira|kfb/.test(name);
  const male = /\bmale\b|남성|injoon|minsu|david|\bguy\b|\bmark\b|george|\bism\b/.test(name);
  if (male && !female) return -10000;
  const quality = /premium|프리미엄/.test(name) ? 600 : /enhanced|고품질/.test(name) ? 400 : 0;
  return quality + (female ? 200 : 10);
}
