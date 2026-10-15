const fs = require('fs');
const path = require('path');

const bookKnowledge = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'book_knowledge.json'), 'utf8')
);
const bookFullText = fs.readFileSync(
  path.join(__dirname, '..', 'data', 'book_full.md'),
  'utf8'
);

// 키워드별 연관 연습 매핑
const KEYWORD_MAP = {
  // 신체 및 호흡 관련
  "숨": [13, 14, 15, 20], // 풍선호흡, 5-4-3-2-1, 어깨이완, 보디스캔
  "호흡": [13, 14, 15, 20],
  "심장": [13, 16, 21], // 풍선호흡, 깜짝선물, 점진적이완
  "두근": [13, 16, 21],
  "어깨": [15, 20, 21], // 어깨와 귀는 멀리
  "긴장": [13, 15, 20, 21],
  "몸": [13, 14, 15, 17, 18, 20, 21],
  "공황": [13, 14, 16],
  "발": [18], // 대지의 중심
  "샤워": [17], "요리": [17], // 그라운딩

  // 생각 및 머릿속 혼돈 관련
  "생각": [1, 2, 3, 4, 5, 6, 8, 10],
  "머리": [1, 3, 6, 12],
  "걱정": [1, 3, 4, 11, 12],
  "반추": [5, 10], // 잃어버린 짐, 토끼굴
  "잡생각": [3, 4, 5, 6, 10],
  "비난": [9], // 자기비판
  "자책": [9],
  "피자": [12],

  // 감정 및 행동, 회피 관련
  "회피": [23, 24, 27, 28, 30, 31, 37],
  "미루": [27, 30, 37], // 과제미루기, 일중독자
  "일": [22, 27, 29, 37],
  "발표": [16, 36, 37], // 예기불안, 달팽이레이스
  "사람": [25, 26, 35], // 타인의시선, 가치행동, 과잉반응
  "시선": [25], // 카메라를 향해 스마일
  "화": [33, 35], // 반대행동, 과잉반응
  "분노": [33, 35],
  "두려움": [16, 23, 24, 36],
  "가면": [32], // 가면증후군
  "완벽": [27, 37, 40]
};

function searchRelevantContext(query) {
  const queryLower = query.toLowerCase();
  const matchedExerciseIndices = new Set();

  for (const [kw, indices] of Object.entries(KEYWORD_MAP)) {
    if (queryLower.includes(kw)) {
      indices.forEach(idx => matchedExerciseIndices.add(idx));
    }
  }

  // 텍스트 매칭으로도 보완
  bookKnowledge.exercises.forEach((ex, idx) => {
    const globalIdx = idx + 1;
    if (
      queryLower.includes(ex.title.toLowerCase()) ||
      queryLower.includes(ex.subtitle.toLowerCase()) ||
      queryLower.includes(ex.tag.toLowerCase()) ||
      ex.description.toLowerCase().split(' ').some(word => word.length > 1 && queryLower.includes(word))
    ) {
      matchedExerciseIndices.add(globalIdx);
    }
  });

  // 매칭된 것이 없다면 불안의 핵심 3대 실천법 기본 추천 (풍선 호흡, 인지적 탈융합, 5-4-3-2-1)
  if (matchedExerciseIndices.size === 0) {
    [13, 6, 14, 2].forEach(i => matchedExerciseIndices.add(i));
  }

  const recommendedExercises = Array.from(matchedExerciseIndices)
    .slice(0, 1)
    .map(idx => bookKnowledge.exercises[idx - 1])
    .filter(Boolean);

  return {
    bookInfo: {
      title: bookKnowledge.title,
      author: bookKnowledge.author,
      translator: bookKnowledge.translator
    },
    recommendedExercises,
    summaryContext: `도서 《${bookKnowledge.title}》(제이미 저커먼 지음)는 수용전념치료(ACT)와 인지행동치료(CBT), 마음챙김에 기반하여 불안을 억누르지 않고 건강하게 분리하고 마주하는 40가지 구체적 연습을 제공합니다.`
  };
}

module.exports = {
  bookKnowledge,
  bookFullText,
  searchRelevantContext
};
