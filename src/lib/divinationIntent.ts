// Match an explicit 점 request, not the syllable inside 점심, 장점, 점검 or 점성술.
// Unicode letter boundaries are needed because JavaScript \b does not delimit Korean words.
export const DIVINATION_REQUEST_PATTERN = /(?:^|[^\p{L}\p{N}_])점(?:\s*(?:을\s*)?(?:좀\s*)?(?:봐|보자|보려|보고\s*싶|볼|쳐|치자|치고\s*싶)|[\s.!?~]*$)/u;
