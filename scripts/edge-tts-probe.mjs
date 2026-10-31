/**
 * Edge 신경망 TTS 진단 프로브 (CI 전용, workflows/edge-tts-probe에서 실행)
 * 서버 api-lib와 동일한 합성 로직을 실제 엔드포인트에 대보고 결과를 요약 출력합니다.
 */
import { connect as tlsConnect } from 'node:tls';
import { createHash, randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4';
const HOST = 'speech.platform.bing.com';
const PATH_BASE = '/consumer/speech/synthesize/readaloud/edge/v1';

function secMsGec(version) {
  const WIN_EPOCH = 11644473600;
  let seconds = Math.floor(Date.now() / 1000) + WIN_EPOCH;
  seconds -= seconds % 300;
  const ticks = BigInt(seconds) * BigInt(10_000_000);
  const gec = createHash('sha256').update(`${ticks}${TRUSTED_CLIENT_TOKEN}`, 'ascii').digest('hex').toUpperCase();
  return { gec, version };
}

function encodeWsTextFrame(text) {
  const payload = Buffer.from(text, 'utf-8');
  const mask = randomBytes(4);
  const masked = Buffer.from(payload);
  for (let i = 0; i < masked.length; i++) masked[i] ^= mask[i % 4];
  let header;
  if (payload.length < 126) {
    header = Buffer.from([0x81, 0x80 | payload.length]);
  } else {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 0x80 | 126;
    header.writeUInt16BE(payload.length, 2);
  }
  return Buffer.concat([header, mask, masked]);
}

function parseWsFrames(buffer) {
  const frames = [];
  let offset = 0;
  while (buffer.length - offset >= 2) {
    const first = buffer[offset];
    const second = buffer[offset + 1];
    const fin = (first & 0x80) !== 0;
    const opcode = first & 0x0f;
    let length = second & 0x7f;
    let pos = offset + 2;
    if (length === 126) { length = buffer.readUInt16BE(pos); pos += 2; }
    else if (length === 127) { length = Number(buffer.readBigUInt64BE(pos)); pos += 8; }
    if (buffer.length - pos < length) break;
    frames.push({ opcode, fin, payload: Buffer.from(buffer.subarray(pos, pos + length)) });
    offset = pos + length;
  }
  return { frames, rest: buffer.subarray(offset) };
}

async function probeOnce(label) {
  const { gec, version } = secMsGec();
  const connectionId = randomBytes(16).toString('hex');
  const requestLine =
    `GET ${PATH_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}` +
    `&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=${version}&ConnectionId=${connectionId} HTTP/1.1\r\n` +
    `Host: ${HOST}\r\n` +
    'Connection: Upgrade\r\n' +
    'Upgrade: websocket\r\n' +
    `Sec-WebSocket-Key: ${randomBytes(16).toString('base64')}\r\n` +
    'Sec-WebSocket-Version: 13\r\n' +
    'Origin: chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold\r\n' +
    'Accept-Language: ko-KR,ko;q=0.9,en;q=0.8\r\n' +
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0\r\n\r\n';

  return new Promise((resolve) => {
    const t0 = Date.now();
    const elapsed = () => `${Date.now() - t0}ms`;
    const tls = tlsConnect({ host: HOST, port: 443, servername: HOST }, () => {
      console.log(`[${label}] TLS connected at ${elapsed()}`);
      tls.write(requestLine);
      let head = '';
      const onHead = (chunk) => {
        head += chunk.toString('latin1');
        const end = head.indexOf('\r\n\r\n');
        if (end === -1) return;
        tls.removeListener('data', onHead);
        const statusLine = head.slice(0, head.indexOf('\r\n'));
        console.log(`[${label}] handshake status: ${statusLine} at ${elapsed()}`);
        if (!/^HTTP\/1\.1 101/.test(statusLine)) {
          let body = head.slice(end + 4);
          tls.on('data', d => { body += d.toString('latin1'); });
          setTimeout(() => { console.log(`[${label}] error body: ${body.slice(0, 300)}`); resolve({ ok: false, statusLine }); }, 1500);
          return;
        }
        let rest = Buffer.from(head.slice(end + 4), 'latin1');
        const stamp = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
        tls.write(encodeWsTextFrame(
          `X-Timestamp:${stamp}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n` +
          JSON.stringify({ context: { synthesis: { audio: { metadataoptions: { sentenceBoundaryEnabled: 'false', wordBoundaryEnabled: 'false' }, outputFormat: 'audio-24khz-48kbitrate-mono-mp3' } } } }),
        ));
        tls.write(encodeWsTextFrame(
          `X-RequestId:${randomBytes(16).toString('hex')}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${stamp}Z\r\nPath:ssml\r\n\r\n` +
          `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='ko-KR'><voice name='ko-KR-SunHiNeural'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>안녕하세요, 신경망 음성 테스트입니다.</prosody></voice></speak>`,
        ));
        let audio = Buffer.alloc(0);
        let turnEnded = false;
        tls.on('data', (d) => {
          rest = Buffer.concat([rest, d]);
          const { frames, rest: restBuffer } = parseWsFrames(rest);
          rest = Buffer.from(restBuffer);
          for (const f of frames) {
            if (f.opcode === 0x8) { resolveAndLog(turnEnded && audio.length > 0); return; }
            if (f.opcode === 0x1) {
              const msg = f.payload.toString('utf-8');
              if (msg.includes('Path:turn.end')) { turnEnded = true; resolveAndLog(audio.length > 0); return; }
            } else if (f.opcode === 0x2 && f.payload.length > 2) {
              const headerLength = f.payload.readUInt16BE(0);
              if (f.payload.length > headerLength + 2) audio = Buffer.concat([audio, f.payload.subarray(headerLength + 2)]);
            }
          }
        });
        const resolveAndLog = (ok) => {
          if (resolved) return;
          resolved = true;
          console.log(`[${label}] audio bytes: ${audio.length}, turnEnded: ${turnEnded} at ${elapsed()}`);
          if (audio.length) writeFileSync('/tmp/edge-tts-sample.mp3', audio);
          resolve({ ok, bytes: audio.length });
        };
        let resolved = false;
        tls.on('error', e => { console.log(`[${label}] socket error:`, e.message); resolveAndLog(false); });
        setTimeout(() => { console.log(`[${label}] TIMEOUT at ${elapsed()}`); resolveAndLog(false); }, 25000);
      };
      tls.on('data', onHead);
    });
    tls.on('error', e => { console.log(`[${label}] tls error:`, e.message); resolve({ ok: false }); });
  });
}

const a = await probeOnce('with-GEC');
console.log('RESULT with-GEC:', JSON.stringify(a));
if (!a.ok) {
  // GEC 없이도 시도해 응답 차이를 확인합니다.
  const b = await probeOnce('diag');
  console.log('RESULT diag:', JSON.stringify(b));
}
