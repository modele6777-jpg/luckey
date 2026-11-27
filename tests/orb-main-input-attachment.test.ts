import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ORB_ATTACHMENT_ACCEPT, ORB_ATTACHMENT_MAX_BYTES, ORB_ATTACHMENT_TEXT_LIMIT,
  classifyOrbAttachment, orbAttachmentPayload, orbAttachmentSizeLabel, orbAttachmentSizeProblem,
  type OrbAttachment,
} from '../src/lib/orb/orbAttachment.ts';

const component = readFileSync(new URL('../src/components/lucy/LucyOrbCounsel.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/components/lucy/lucy-orb-counsel.css', import.meta.url), 'utf8');
const liveSession = readFileSync(new URL('../src/lib/geminiLiveSession.ts', import.meta.url), 'utf8');

const image: OrbAttachment = { kind: 'image', name: '손금.jpg', size: 320_000, dataUrl: 'data:image/jpeg;base64,AAAA' };
const textFile: OrbAttachment = { kind: 'text', name: '고민.txt', size: 120, text: '요즘 일이 잘 안 풀려요' };
const pdf: OrbAttachment = { kind: 'pdf', name: '사주풀이.pdf', size: 90_000 };

test('the camera button accepts photos and 글 파일, and turns away other formats', () => {
  assert.equal(ORB_ATTACHMENT_ACCEPT, 'image/*,application/pdf,.txt,.md,.csv,.json');
  assert.equal(classifyOrbAttachment('photo.jpg', 'image/jpeg'), 'image');
  assert.equal(classifyOrbAttachment('IMG_0001.HEIC', 'image/heic'), 'image');
  assert.equal(classifyOrbAttachment('메모.txt', ''), 'text');
  assert.equal(classifyOrbAttachment('표.csv', 'text/csv'), 'text');
  assert.equal(classifyOrbAttachment('자료.json', ''), 'text');
  assert.equal(classifyOrbAttachment('사주풀이.pdf', 'application/pdf'), 'pdf');
  assert.equal(classifyOrbAttachment('영상.mp4', 'video/mp4'), null);
  assert.equal(classifyOrbAttachment('압축.zip', 'application/zip'), null);
});

test('an attachment over 15MB or empty is refused with a plain notice', () => {
  assert.equal(orbAttachmentSizeProblem(0), '빈 파일은 보낼 수 없어요.');
  assert.equal(orbAttachmentSizeProblem(1024), '');
  assert.equal(orbAttachmentSizeProblem(ORB_ATTACHMENT_MAX_BYTES), '');
  assert.match(orbAttachmentSizeProblem(ORB_ATTACHMENT_MAX_BYTES + 1), /15MB/);
  assert.equal(orbAttachmentSizeLabel(900), '900B');
  assert.equal(orbAttachmentSizeLabel(2048), '2KB');
  assert.equal(orbAttachmentSizeLabel(2 * 1024 * 1024), '2.0MB');
});

test('a photo is sent as an image, a 글 파일 as its text, and a PDF is announced honestly', () => {
  const photo = orbAttachmentPayload(image, '이 손금 봐 주세요');
  assert.equal(photo.kind, 'image');
  assert.equal(photo.kind === 'image' && photo.dataUrl, 'data:image/jpeg;base64,AAAA');
  assert.match(photo.caption, /사진을 함께 보냈습니다/);
  assert.match(photo.caption, /손님의 말: 이 손금 봐 주세요/);

  const note = orbAttachmentPayload(textFile);
  assert.equal(note.kind, 'text');
  assert.match(note.kind === 'text' ? note.text : '', /고민\.txt/);
  assert.match(note.kind === 'text' ? note.text : '', /요즘 일이 잘 안 풀려요/);
  assert.doesNotMatch(note.caption, /손님의 말/);

  const document = orbAttachmentPayload(pdf);
  assert.equal(document.kind, 'text');
  assert.match(document.caption, /PDF 내용을 읽을 수 없습니다/);
  assert.match(document.caption, /사진으로 찍어 보내거나/);

  const long: OrbAttachment = { kind: 'text', name: '긴글.txt', size: 1, text: '가'.repeat(ORB_ATTACHMENT_TEXT_LIMIT + 500) };
  const trimmed = orbAttachmentPayload(long);
  assert.ok((trimmed.kind === 'text' ? trimmed.text : '').length < ORB_ATTACHMENT_TEXT_LIMIT + 100);
});

test('the orb composer carries a camera button beside the input with a hidden file picker', () => {
  assert.match(component, /className="lucy-orb-camera" onClick=\{chooseAttachment\} aria-label="사진·파일 첨부" title="사진·파일 첨부"/);
  assert.match(component, /<Camera size=\{18\} aria-hidden="true" \/>/);
  assert.match(component, /ref=\{attachInputRef\}[\s\S]{0,120}type="file"[\s\S]{0,120}accept=\{ORB_ATTACHMENT_ACCEPT\}/);
  assert.match(component, /onChange=\{\(event\) => void onAttachmentPicked\(event\)\}/);
  assert.match(css, /\.lucy-orb-attach-input \{ display: none; \}/);
  assert.match(css, /\.lucy-orb-dock \.lucy-orb-camera \{[\s\S]*?flex: 0 0 44px;[\s\S]*?border-radius: 999px;/);
});

test('the camera button sits left of the input, and the file picker never shows up as a box', () => {
  const rowStart = component.indexOf('<div className="lucy-orb-composer-row">');
  const rowEnd = component.indexOf('<button type="button" className="lucy-orb-send"', rowStart);
  assert.ok(rowStart > -1 && rowEnd > rowStart, 'composer row and its send button must exist');
  const row = component.slice(rowStart, rowEnd);
  const cameraAt = row.indexOf('className="lucy-orb-camera"');
  const inputWrapAt = row.indexOf('className="lucy-orb-input-wrap"');
  assert.ok(cameraAt > -1, 'the camera button must live inside the composer row');
  assert.ok(inputWrapAt > -1, 'the text input must live inside the composer row');
  // 왼쪽부터 📷 카메라 → 텍스트 입력창 → 전송.
  assert.ok(cameraAt < inputWrapAt, 'the camera button must come before the text input');
  assert.equal(row.match(/lucy-orb-camera/g)?.length, 1, 'only one camera button in the row');

  // 파일 선택 인풋은 hidden 속성과 display: none 규칙 두 겹으로 숨긴다.
  assert.match(component, /ref=\{attachInputRef\}[\s\S]{0,300}?\n\s*hidden\n/);
  assert.match(css, /\.lucy-orb-dock input\.lucy-orb-attach-input,\s*\ninput\[type="file"\]\.lucy-orb-attach-input \{ display: none; \}/);
  // 입력창 스타일은 파일 인풋에 닿지 않는다(예전 .lucy-orb-dock input 규칙이 display: block을 덮어써 '파일 선택' 박스가 보였음).
  assert.match(css, /\.lucy-orb-dock input:not\(\[type="file"\]\) \{/);
  assert.doesNotMatch(css, /\.lucy-orb-dock input \{/, 'no bare dock input rule may style the file input');
  assert.doesNotMatch(css, /\.lucy-orb-dock input\[type="file"\]/);
});

test('a picked photo or file shows a preview above the input and can be removed', () => {
  assert.match(component, /<div className="lucy-orb-attach" role="status">/);
  assert.match(component, /attachment\.kind === 'image' && attachment\.dataUrl[\s\S]{0,120}<img src=\{attachment\.dataUrl\}/);
  assert.match(component, /className="lucy-orb-attach-remove" onClick=\{clearAttachment\} aria-label="첨부 삭제"/);
  assert.match(component, /<X size=\{14\} aria-hidden="true" \/>/);
  assert.match(component, /const onAttachmentPicked = async \(event: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?setAttachment\(await readOrbAttachmentFile\(file\)\)/);
  assert.match(css, /\.lucy-orb-attach img \{ width: 34px; height: 34px;/);
});

test('a photo alone enables sending, and the main screen starts a master and delivers it', () => {
  assert.match(component, /disabled=\{rolling \|\| micPermissionBusy \|\| talkPressed \|\| \(!draft\.trim\(\) && !attachment\)\}/);
  // 메인화면(phase === 'pick')에서도 입력창이 보인다.
  assert.match(component, /\{\(phase === 'pick' \|\| phase === 'live'\) && \(\s*<div className="lucy-orb-dock lucy-orb-composer">/);
  // 고르는 단계가 없으므로 마스터 루시로 바로 시작한다 (구형 마스터 id는 resolveOrbMaster가 매핑).
  assert.match(component, /const pickStartMaster = \(\): OrbMaster => resolveOrbMaster\(memory\[0\]\?\.masterId\);/);
  assert.match(component, /const session = sessionRef\.current;\s*if \(!session\) \{[\s\S]*?begin\(pickStartMaster\(\), undefined, true, false, \{ text, attachment: note \?\? undefined \}\);/);
  // 시작하면서 적은 말·첨부를 한 차례에 건넨다.
  assert.match(component, /const payload = orbAttachmentPayload\(note, typed\);[\s\S]*?session\.sendAttachment\(payload\.kind === 'image'/);
  // 이미 상담 중이면 첨부만 따로 보낸다.
  assert.match(component, /const sent = session\.sendAttachment\(payload\.kind === 'image'/);
  assert.match(component, /userBuf\.current = text \|\| `📎 \$\{note\.name\}`;/);
});

test('a long press on the main-screen input starts counseling and listens right away', () => {
  assert.match(component, /if \(!sessionRef\.current && phase === 'pick'\) \{[\s\S]*?begin\(pickStartMaster\(\), undefined, false\);[\s\S]*?startPushToTalk\(\);/);
});

test('the live session can carry a photo or file as its own guest turn, even before it connects', () => {
  assert.match(liveSession, /sendAttachment: \(attachment: LiveAttachment, measureTurn\?: boolean\) => boolean;/);
  assert.match(liveSession, /\{ kind: 'image'; dataUrl: string; caption\?: string \}/);
  assert.match(liveSession, /parts\.push\(\{ inlineData: \{ mimeType: match\[1\], data: match\[2\] \} \}\);/);
  assert.match(liveSession, /const queued = pendingSends\.splice\(0, pendingSends\.length\);/);
  assert.match(liveSession, /pendingSends\.push\(\{ kind: 'attachment', attachment, measureTurn \}\);/);
});
