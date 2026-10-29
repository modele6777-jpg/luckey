# OpenAI runtime connection — v1.4.569

Runtime credentials remain Sites secrets. The existing `open ai` secret is accepted without reading, copying or renaming its plaintext. `OPENAI_API_KEY` is the canonical alternative. If both providers are configured, `AI_PROVIDER` may explicitly select `openai` or `gemini`; otherwise an OpenAI key selects OpenAI.

The existing `/api/openai/v1/chat/completions` client contract, including images, JSON and SSE, stays the same. OpenAI uses `gpt-5.4-mini` by default, with model-appropriate token/reasoning fields. `OPENAI_CHAT_MODEL` can override it. Other text-generation routes use this same adapter.

`/api/ai/tts` uses the documented Speech API with `gpt-4o-mini-tts`, optional `OPENAI_TTS_MODEL`, and MP3 bytes. Existing female/male voice identifiers map to `marin`/`cedar`. Only narration is in `input`; style instructions have their own field. No browser voice fallback is introduced. The player identifies AI-generated speech.

**Lifecycle:** the current OpenAI speech guide states that this Speech API model shuts down on 2027-01-06 and recommends the Realtime API (`gpt-realtime-2.1-mini`). That model cannot simply be substituted in `/v1/audio/speech`; the Realtime workflow must be implemented before shutdown. Current integration uses the documented, still-supported Speech API to restore narration now.

AI image generation is unchanged and still requires a Gemini key. This release migrates chat/text and speech, not images.

References: https://developers.openai.com/api/docs/guides/text-to-speech and https://developers.openai.com/api/docs/models/gpt-5.4-mini .
