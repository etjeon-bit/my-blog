function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function tagChips(tags, { basePrefix = '' } = {}) {
  if (!tags.length) return '';
  return `<ul class="tag-list">${tags
    .map(
      (tag) =>
        `<li><a class="tag-chip" href="${basePrefix}tags/${encodeURIComponent(
          tag
        )}.html">${escapeHtml(tag)}</a></li>`
    )
    .join('')}</ul>`;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return escapeHtml(dateStr);
  return date.toISOString().slice(0, 10);
}

export function postListItem(post, { basePrefix = '' } = {}) {
  return `
    <li class="post-item">
      <a class="post-item__title" href="${basePrefix}posts/${post.slug}.html">${escapeHtml(
    post.title
  )}</a>
      <time class="post-item__date" datetime="${post.date}">${formatDate(
    post.date
  )}</time>
      ${tagChips(post.tags, { basePrefix })}
      <p class="post-item__excerpt">${escapeHtml(post.excerpt)}</p>
    </li>`;
}

function searchBox() {
  return `
    <div class="search-box">
      <input
        type="search"
        id="search-input"
        placeholder="글 제목이나 내용 검색…"
        aria-label="글 검색"
      />
      <ul id="search-results" class="post-list" hidden></ul>
    </div>`;
}

export function layout({ title, content, basePrefix = '', includeSearch = false }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${basePrefix}assets/css/style.css" />
<script>
(function () {
  var saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);
})();
</script>
</head>
<body>
<header class="site-header">
  <a class="site-title" href="${basePrefix}index.html">My Blog</a>
  <button id="theme-toggle" class="theme-toggle" type="button" aria-label="다크 모드 전환">🌓</button>
</header>
<main id="main-content">
${content}
</main>
<footer class="site-footer">
  <p>마크다운으로 작성된 정적 블로그</p>
</footer>
<script src="${basePrefix}assets/js/theme.js" defer></script>
${includeSearch ? `<script src="${basePrefix}assets/js/search.js" defer></script>` : ''}
</body>
</html>`;
}

export function homePage(posts, tags) {
  const content = `
    <h1>글 목록</h1>
    ${searchBox()}
    ${
      tags.length
        ? `<nav class="tag-filter" aria-label="태그 필터">
            <a class="tag-chip" href="index.html">전체</a>
            ${tags
              .map(
                (tag) =>
                  `<a class="tag-chip" href="tags/${encodeURIComponent(
                    tag
                  )}.html">${escapeHtml(tag)}</a>`
              )
              .join('')}
          </nav>`
        : ''
    }
    <ul id="post-list" class="post-list">
      ${posts.map((post) => postListItem(post)).join('')}
    </ul>`;

  return layout({ title: 'My Blog', content, includeSearch: true });
}

export function postPage(post) {
  const content = `
    <article class="post">
      <h1>${escapeHtml(post.title)}</h1>
      <time class="post__date" datetime="${post.date}">${formatDate(
    post.date
  )}</time>
      ${tagChips(post.tags, { basePrefix: '../' })}
      <div class="post__body">
        ${post.html}
      </div>
    </article>`;

  return layout({ title: post.title, content, basePrefix: '../' });
}

export function tagPage(tag, posts) {
  const content = `
    <h1>태그: ${escapeHtml(tag)}</h1>
    <p><a href="../index.html">← 전체 글로 돌아가기</a></p>
    <ul class="post-list">
      ${posts.map((post) => postListItem(post, { basePrefix: '../' })).join('')}
    </ul>`;

  return layout({ title: `태그: ${tag}`, content, basePrefix: '../' });
}
