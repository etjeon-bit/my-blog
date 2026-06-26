---
title: Hello World
date: 2026-06-20
tags: [intro, meta]
---

이 블로그는 마크다운 파일을 정적 HTML로 변환하는 빌드 스크립트로 만들어졌습니다. 프레임워크 없이 순수 HTML, CSS, JavaScript만 사용합니다.

## 특징

- 다크 모드 지원 (시스템 설정 감지 + 수동 토글)
- 모바일 반응형 레이아웃
- 태그별 글 분류
- 클라이언트 사이드 검색

## 코드 예시

```js
function greet(name) {
  return `Hello, ${name}!`;
}
```

새 글을 추가하려면 `posts/` 디렉터리에 마크다운 파일을 만들고 `npm run build`를 실행하세요.
