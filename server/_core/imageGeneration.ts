export async function generateImage({ prompt }: { prompt: string }) {
  console.log("Generating image with prompt:", prompt);
  // Using a placeholder service or actual generation if supported
  return { url: `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` };
}
