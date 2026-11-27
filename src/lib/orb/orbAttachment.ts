/**
 * 🔮 오브 메인화면 입력창의 사진·파일 첨부.
 * 사진은 압축한 data URL로, 글 파일(.txt·.md·.csv·.json)은 읽은 글자로 마스터에게 건넨다.
 * PDF는 실시간 음성 상담에서 내용을 읽지 못하므로 파일 이름만 알리고 손님께 안내하게 한다.
 */
import { compressImageToDataUrl } from '../../utils/imageCompress';

export const ORB_ATTACHMENT_ACCEPT = 'image/*,application/pdf,.txt,.md,.csv,.json';
export const ORB_ATTACHMENT_MAX_BYTES = 15 * 1024 * 1024;
export const ORB_ATTACHMENT_TEXT_LIMIT = 6000;
const ORB_ATTACHMENT_IMAGE_DIM = 1280;

export type OrbAttachmentKind = 'image' | 'text' | 'pdf';

export type OrbAttachment = {
  kind: OrbAttachmentKind;
  name: string;
  size: number;
  /** 사진: 마스터에게 보내고 입력창 위 미리보기로도 쓰는 data URL */
  dataUrl?: string;
  /** 글 파일: 읽은 내용 (길면 잘라 둔다) */
  text?: string;
};

/** 라이브 세션에 한 차례(손님 차례)로 보내는 모양. */
export type OrbAttachmentPayload =
  | { kind: 'image'; dataUrl: string; caption: string }
  | { kind: 'text'; text: string; caption: string };

const TEXT_EXTENSIONS = ['.txt', '.text', '.md', '.markdown', '.csv', '.tsv', '.json', '.log'];

/** 파일 이름과 형식으로 어떻게 보낼지 정한다. 지원하지 않는 형식이면 null. */
export function classifyOrbAttachment(name: string, mimeType = ''): OrbAttachmentKind | null {
  const type = String(mimeType || '').toLowerCase();
  const lower = String(name || '').toLowerCase();
  if (type.startsWith('image/')) return 'image';
  if (type === 'application/pdf' || lower.endsWith('.pdf')) return 'pdf';
  if (TEXT_EXTENSIONS.some(extension => lower.endsWith(extension))) return 'text';
  if (type.startsWith('text/') || type.includes('json') || type.includes('csv')) return 'text';
  return null;
}

/** 첨부할 수 없는 크기면 안내 문구를, 괜찮으면 빈 문자열을 돌려준다. */
export function orbAttachmentSizeProblem(size: number): string {
  if (!Number.isFinite(size) || size <= 0) return '빈 파일은 보낼 수 없어요.';
  if (size > ORB_ATTACHMENT_MAX_BYTES) return '사진·파일은 15MB까지 보낼 수 있어요.';
  return '';
}

/** 입력창 위 미리보기에 쓰는 크기 표기. */
export function orbAttachmentSizeLabel(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  if (bytes < 1024) return `${Math.round(bytes)}B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * 마스터에게 건네는 한 차례: 사진은 inlineData, 글 파일은 글자로 보내고,
 * caption 에는 "이것이 무엇인지"와 손님이 함께 적은 말을 담는다 (지시가 아니라 자료 설명).
 */
export function orbAttachmentPayload(attachment: OrbAttachment, typed = ''): OrbAttachmentPayload {
  const said = String(typed || '').replace(/\s+/g, ' ').trim().slice(0, 400);
  const head = said ? `손님의 말: ${said}` : '';
  if (attachment.kind === 'image' && attachment.dataUrl) {
    return {
      kind: 'image',
      dataUrl: attachment.dataUrl,
      caption: [`손님이 사진을 함께 보냈습니다 (${attachment.name}). 사진에서 보이는 단서를 먼저 짚은 뒤 답하세요.`, head].filter(Boolean).join(' '),
    };
  }
  if (attachment.kind === 'pdf') {
    return {
      kind: 'text',
      text: `[PDF 첨부] ${attachment.name}`,
      caption: [
        `손님이 PDF 파일 '${attachment.name}'을 올렸지만 이 음성 상담에서는 PDF 내용을 읽을 수 없습니다. 양해를 정중히 구하고, 사진으로 찍어 보내거나 중요한 내용을 적어 달라고 안내한 뒤 지금까지의 대화로 상담을 이어 가세요.`,
        head,
      ].filter(Boolean).join(' '),
    };
  }
  return {
    kind: 'text',
    text: `[파일 첨부] ${attachment.name}\n${String(attachment.text || '').slice(0, ORB_ATTACHMENT_TEXT_LIMIT)}`,
    caption: [`손님이 파일 '${attachment.name}'을 보냈습니다. 파일 내용을 참고해 답하세요.`, head].filter(Boolean).join(' '),
  };
}

function readFileAsText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
    reader.readAsText(file);
  });
}

/** 고른 파일을 상담에 보낼 모양으로 읽는다 (사진은 압축, 글 파일은 글자, PDF는 이름만). */
export async function readOrbAttachmentFile(file: File): Promise<OrbAttachment> {
  const kind = classifyOrbAttachment(file.name, file.type);
  if (!kind) throw new Error('지원하지 않는 파일 형식입니다.');
  const base = { kind, name: file.name || '첨부 파일', size: file.size };
  if (kind === 'image') {
    const dataUrl = await compressImageToDataUrl(file, ORB_ATTACHMENT_IMAGE_DIM, 0.82);
    return { ...base, dataUrl };
  }
  if (kind === 'text') {
    const text = await readFileAsText(file);
    return { ...base, text: text.slice(0, ORB_ATTACHMENT_TEXT_LIMIT) };
  }
  return base;
}
