/**
 * 🔊 고품질 TTS — 제로 의존성 Microsoft Edge 신경망 음성 (Node 런타임 전용)
 *
 * Microsoft Edge Read Aloud가 쓰는 신경망 보이스(ko-KR-SunHiNeural · ko-KR-InJoonNeural 등)를
 * 외부 패키지 없이 순수 node:tls + node:crypto WebSocket으로 직접 합성합니다.
 * (이전 구현의 translate.google.com 기계음은 완전히 제거되었습니다.)
 *
 * ⚡ 빠른 실패 전략: Microsoft WAF가 서버리스 데이터센터 IP의 WebSocket을 403으로
 * 차단하는 것이 확인되었습니다. 그래서 재시도·폴백 없이 짧은 제한 시간 안에
 * 즉시 실패를 반환하고, 클라이언트(src/utils/tts.ts)가 기기 내 고품질 신경망
 * 보이스(iOS Siri·Natural·Neural·Google 고음질)로 지체 없이 바로 낭독합니다.
 * 차단이 풀리는 날에는 이 엔진이 자동으로 다시 48kbps MP3 고품질을 돌려줍니다.
 *
 * - node-edge-tts 패키지를 쓰지 않으므로 Vercel 서버리스 번들에서
 *   `Cannot find module './lib/stream'`(FUNCTION_INVOCATION_FAILED) 문제가 재발하지 않습니다.
 */
import { createHash, randomBytes } from 'node:crypto';
import { connect as tlsConnect, type TLSSocket } from 'node:tls';
import type { Socket } from 'node:net';

/** 기본/여성 보이스 (Lucy·Aoede 계열) — 한국어 신경망 고품질 */
export const EDGE_TTS_FEMALE = 'ko-KR-SunHiNeural';
/** 남성 보이스 (Charon 계열) — 한국어 신경망 고품질 */
export const EDGE_TTS_MALE = 'ko-KR-InJoonNeural';

/** 앱 persona 보이스 → 신경망 TTS 보이스 매핑 (호출부 호환을 위해 유지) */
export function resolveEdgeTtsVoice(voice?: string): { voice: string; lang: string } {
  const requested = String(voice || '').trim();
  // 명시적인 신경망 보이스 이름(ko-KR-InJoonNeural 등)은 그대로 사용.
  if (/^[a-z]{2,3}-[A-Z]{2,}-\w+Neural$/i.test(requested)) {
    return { voice: requested, lang: requested.split('-').slice(0, 2).join('-') };
  }
  if (/^(Charon|InJoon|male|man|남성|남자)$/i.test(requested) || /InJoonNeural/i.test(requested)) {
    return { voice: EDGE_TTS_MALE, lang: 'ko-KR' };
  }
  return { voice: EDGE_TTS_FEMALE, lang: 'ko-KR' };
}

export interface EdgeTtsResult {
  /** mp3 오디오의 base64 문자열 */
  audioContent: string;
  encoding: 'mp3';
  sampleRate: 24000;
  voice: string;
  provider: 'edge-neural';
}

/** ⚡ 빠른 실패: 차단 시 클라이언트 폴백(기기 신경망 보이스)을 즉시 만나도록 짧게 유지 */
const CHUNK_TIMEOUT_MS = 6000;
/** 문장 하나를 신경망 엔진에 안전하게 넘기는 청크 길이 (엔진 제한보다 넉넉히 낮게) */
const MAX_CHUNK_CHARS = 450;

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const EDGE_SPEECH_HOST = 'speech.platform.bing.com';
const EDGE_SPEECH_PATH = '/consumer/speech/synthesize/readaloud/edge/v1';
const EDGE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0';

/**
 * Edge TTS 엔드포인트가 요구하는 Sec-MS-GEC (DRM 토큰)를 만듭니다.
 * Windows FILETIME 틱을 5분 단위로 내림한 값 + 신뢰 토큰의 SHA-256 대문자 hex입니다.
 */
function secMsGec(): { gec: string; version: string } {
  const WIN_EPOCH = 11644473600;
  let seconds = Math.floor(Date.now() / 1000) + WIN_EPOCH;
  seconds -= seconds % 300;
  const ticks = BigInt(seconds) * BigInt(10_000_000);
  const gec = createHash('sha256')
    .update(`${ticks}${TRUSTED_CLIENT_TOKEN}`, 'ascii')
    .digest('hex')
    .toUpperCase();
  return { gec, version: '1-130.0.2849.68' };
}

/** 최소한의 마스킹된 WebSocket 프레임(텍스트)을 인코딩합니다. */
function encodeWsTextFrame(text: string): Buffer {
  const payload = Buffer.from(text, 'utf-8');
  const mask = randomBytes(4);
  const masked = Buffer.from(payload);
  for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
  let header: Buffer;
  if (payload.length < 126) {
    header = Buffer.from([0x81, 0x80 | payload.length]);
  } else if (payload.length <= 0xffff) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 0x80 | 127;
    header.writeBigUInt64BE(BigInt(payload.length), 2);
  }
  return Buffer.concat([header, mask, masked]);
}

interface WsFrame {
  opcode: number;
  fin: boolean;
  payload: Buffer;
}

/** 수신 버퍼에서 WebSocket 프레임을 파싱합니다. (서버 → 클라이언트는 비마스킹) */
function parseWsFrames(buffer: Buffer): { frames: WsFrame[]; rest: Buffer } {
  const frames: WsFrame[] = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const fin = (first & 0x80) !== 0;
    const opcode = first & 0x0f;
    const masked = (second & 0x80) !== 0;
    let length = second & 0x7f;
    let pos = offset + 2;
    if (length === 126) {
      if (buffer.length - pos < 2) break;
      length = buffer.readUInt16BE(pos);
      pos += 2;
    } else if (length === 127) {
      if (buffer.length - pos < 8) break;
      const big = buffer.readBigUInt64BE(pos);
      if (big > BigInt(buffer.length - pos - 8)) break;
      length = Number(big);
      pos += 8;
    }
    if (buffer.length - pos < length) break;
    const payload = Buffer.from(buffer.subarray(pos, pos + length));
    frames.push({ opcode, fin, payload });
    offset = pos + length;
  }
  return { frames, rest: buffer.subarray(offset) };
}

/**
 * Edge TTS 서버로 TLS 연결을 맺고 HTTP/1.1 WebSocket 업그레이드 핸드셰이크를 완료합니다.
 * 성공하면 업그레이드된 소켓과, 핸드셰이크 응답 말미에 이미 도착한 데이터를 돌려줍니다.
 */
function openEdgeTtsSocket(timeoutMs: number): Promise<{ socket: TLSSocket; rest: Buffer }> {
  const { gec, version } = secMsGec();
  const connectionId = randomBytes(16).toString('hex');
  const requestLine =
    `GET ${EDGE_SPEECH_PATH}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
    `&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=${version}&ConnectionId=${connectionId} HTTP/1.1\r\n` +
    `Host: ${EDGE_SPEECH_HOST}\r\n` +
    'Connection: Upgrade\r\n' +
    'Upgrade: websocket\r\n' +
    `Sec-WebSocket-Key: ${randomBytes(16).toString('base64')}\r\n` +
    'Sec-WebSocket-Version: 13\r\n' +
    'Pragma: no-cache\r\n' +
    'Cache-Control: no-cache\r\n' +
    'Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold\r\n' +
    'Accept-Language: ko-KR,ko;q=0.9,en;q=0.8\r\n' +
    `User-Agent: ${EDGE_UA}\r\n\r\n`;

  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(Object.assign(new Error('Edge 신경망 TTS 연결이 시간 내에 완료되지 않았습니다.'), { status: 504 }));
    }, timeoutMs);
    const clear = () => clearTimeout(timer);
    const settleReject = (error: Error) => {
      if (settled) return;
      settled = true;
      clear();
      reject(error);
    };

    const startHandshake = (socket: Socket) => {
      socket.setNoDelay(true);
      socket.write(requestLine);
      let head = '';
      const onHead = (chunk: Buffer) => {
        head += chunk.toString('latin1');
        const end = head.indexOf('\r\n\r\n');
        if (end === -1) return;
        socket.removeListener('data', onHead);
        const statusLine = head.slice(0, head.indexOf('\r\n'));
        if (/^HTTP\/1\.1 101/.test(statusLine)) {
          settled = true;
          clear();
          resolve({ socket: socket as TLSSocket, rest: Buffer.from(head.slice(end + 4), 'latin1') });
        } else {
          socket.destroy();
          const status = Number(statusLine.split(' ')[1]) || 502;
          settleReject(Object.assign(
            new Error(`Edge 신경망 TTS 연결이 거부되었습니다 (${statusLine || 'no status'}).`),
            { status: status === 401 || status === 403 ? 403 : status },
          ));
        }
      };
      socket.on('data', onHead);
    };

    const tls = tlsConnect({ host: EDGE_SPEECH_HOST, port: 443, servername: EDGE_SPEECH_HOST }, () => {
      if (settled) { tls.destroy(); return; }
      startHandshake(tls);
    });
    tls.on('error', settleReject);
  });
}

/**
 * Edge TTS WebSocket 연결 하나로 텍스트 청크 하나를 신경망 mp3로 합성합니다.
 * ws 같은 의존성 없이 순수 node:tls 위에서 프레임 프로토콜을 직접 다룹니다.
 */
async function synthesizeChunkWithEdgeNeural(
  chunk: string,
  voice: string,
  lang: string,
  timeoutMs = CHUNK_TIMEOUT_MS,
): Promise<Buffer> {
  const { socket, rest } = await openEdgeTtsSocket(timeoutMs);
  return new Promise<Buffer>((resolve, reject) => {
    const audioParts: Buffer[] = [];
    let receiveBuffer = rest;
    let fragmentOpcode = 0;
    const fragmentParts: Buffer[] = [];
    let settled = false;
    const finish = (error: Error | null, audio?: Buffer) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { socket.destroy(); } catch (_) {}
      if (error) reject(error);
      else resolve(audio!);
    };
    const timer = setTimeout(() => {
      finish(Object.assign(new Error('Edge 신경망 TTS 합성이 시간 내에 완료되지 않았습니다.'), { status: 504 }));
    }, timeoutMs);

    const now = new Date();
    const stamp = now.toISOString().replace(/\.\d+Z$/, 'Z');

    socket.write(encodeWsTextFrame(
      `X-Timestamp:${stamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
      JSON.stringify({
        context: {
          synthesis: {
            audio: {
              metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' },
              outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
            },
          },
        },
      }),
    ));

    const requestId = randomBytes(16).toString('hex');
    socket.write(encodeWsTextFrame(buildEdgeTtsSsmlMessage(chunk, voice, lang, stamp, requestId)));

    socket.on('data', (incoming: Buffer) => {
      receiveBuffer = Buffer.concat([receiveBuffer, incoming]);
      const { frames, rest: restBuffer } = parseWsFrames(receiveBuffer);
      receiveBuffer = Buffer.from(restBuffer);
      for (const frame of frames) {
        if (frame.opcode === 0x8) {
          finish(audioParts.length
            ? null
            : new Error('Edge 신경망 TTS가 오디오 없이 연결을 닫았습니다.'));
          return;
        }
        if (frame.opcode === 0x1) {
          const message = frame.payload.toString('utf-8');
          if (message.includes('Path:turn.end')) {
            finish(null, Buffer.concat(audioParts));
            return;
          }
        } else if (frame.opcode === 0x2) {
          // 바이너리 프레임: 앞 2바이트 = 헤더 길이(빅 엔디안), 이후가 오디오 MP3 데이터.
          if (frame.payload.length > 2) {
            const headerLength = frame.payload.readUInt16BE(0);
            if (frame.payload.length > headerLength + 2) {
              audioParts.push(frame.payload.subarray(headerLength + 2));
            }
          }
        } else if (frame.opcode === 0x0) {
          // 연속 프레임: 이전 프레임의 데이터에 이어 붙입니다.
          fragmentParts.push(frame.payload);
          if (frame.fin) {
            const combined = Buffer.concat(fragmentParts);
            fragmentParts.length = 0;
            const baseOpcode = fragmentOpcode;
            fragmentOpcode = 0;
            if (baseOpcode === 0x2 && combined.length > 2) {
              const headerLength = combined.readUInt16BE(0);
              if (combined.length > headerLength + 2) {
                audioParts.push(combined.subarray(headerLength + 2));
              }
            } else if (baseOpcode === 0x1 && combined.toString('utf-8').includes('Path:turn.end')) {
              finish(null, Buffer.concat(audioParts));
              return;
            }
          }
        } else {
          fragmentOpcode = frame.opcode;
          fragmentParts.length = 0;
          fragmentParts.push(frame.payload);
        }
      }
    });
    socket.on('error', error => finish(error));
    socket.on('close', () => {
      finish(audioParts.length ? null : new Error('Edge 신경망 TTS 연결이 조기 종료되었습니다.'));
    });
  });
}

/** 문장 · 문단 부호 경계를 존중하면서 MAX_CHUNK_CHARS 이하 청크로 나눕니다. */
function splitSpeechIntoFreeChunks(speech: string): string[] {
  const sentences = speech.match(/[^.!?。！？\n]+(?:[.!?。！？\n]+["'”’]?|\s*$)/g) || [speech];
  const units: string[] = [];
  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    if (sentence.length <= MAX_CHUNK_CHARS) {
      units.push(sentence);
      continue;
    }
    // 한 문장이 지나치게 길면 절(쉼표·세미콜론·줄바꿈) 경계로 나눕니다.
    const clauses = sentence.match(/[^,，;；\n]+(?:[,，;；\n]+|\s*$)/g) || [sentence];
    let current = '';
    for (const rawClause of clauses) {
      const clause = rawClause.trim();
      if (!clause) continue;
      if (current && current.length + clause.length + 1 > MAX_CHUNK_CHARS) {
        units.push(current);
        current = clause;
      } else {
        current = current ? `${current} ${clause}` : clause;
      }
      // 절마저 길면 공백 기준으로 잘라냅니다.
      while (current.length > MAX_CHUNK_CHARS) {
        let cut = current.lastIndexOf(' ', MAX_CHUNK_CHARS);
        if (cut < Math.floor(MAX_CHUNK_CHARS / 2)) cut = MAX_CHUNK_CHARS;
        units.push(current.slice(0, cut).trim());
        current = current.slice(cut).trim();
      }
    }
    if (current) units.push(current);
  }
  return units.length > 0 ? units : [speech];
}

/** Build a protocol-valid SSML request; the ISO timestamp already ends in Z. */
export function buildEdgeTtsSsmlMessage(chunk: string, voice: string, lang: string, stamp: string, requestId: string): string {
  const escaped = chunk
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  return `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp}\r\nPath:ssml\r\n\r\n` +
    `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'>` +
    `<voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escaped}</prosody></voice></speak>`;
}

/** 신경망 TTS로 mp3 음성을 합성합니다. 실패 시 예외를 던지므로 호출부가 적절히 안내할 수 있습니다. */
export async function synthesizeWithEdgeTTS(speech: string, voice?: string): Promise<EdgeTtsResult> {
  const clean = String(speech || '').trim();
  if (!clean) throw new Error('낭독할 문장이 비어 있습니다.');

  const resolved = resolveEdgeTtsVoice(voice);
  const lang = resolved.lang;
  const chunks = splitSpeechIntoFreeChunks(clean);

  const parts: Buffer[] = [];
  for (let index = 0; index < chunks.length; index++) {
    // ⚡ 빠른 실패: 재시도·기계음 폴백 없이 단 한 번만 시도합니다.
    const audio = await synthesizeChunkWithEdgeNeural(chunks[index], resolved.voice, lang);
    parts.push(audio);
  }

  const combined = Buffer.concat(parts);
  if (!combined.length) throw new Error('음성 합성이 빈 오디오를 반환했습니다.');
  return {
    audioContent: combined.toString('base64'),
    encoding: 'mp3',
    sampleRate: 24000,
    voice: resolved.voice,
    provider: 'edge-neural',
  };
}
