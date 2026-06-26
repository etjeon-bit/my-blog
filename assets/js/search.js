(function () {
  const input = document.getElementById('search-input');
  const resultsEl = document.getElementById('search-results');
  const listEl = document.getElementById('post-list');
  if (!input || !resultsEl || !listEl) return;

  let index = null;
  let debounceTimer = null;

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderResultItem(post) {
    const tags = post.tags
      .map(
        (tag) =>
          `<li><a class="tag-chip" href="tags/${encodeURIComponent(tag)}.html">${escapeHtml(
            tag
          )}</a></li>`
      )
      .join('');
    return `
      <li class="post-item">
        <a class="post-item__title" href="posts/${post.slug}.html">${escapeHtml(
      post.title
    )}</a>
        <time class="post-item__date" datetime="${post.date}">${escapeHtml(
      post.date
    )}</time>
        ${tags ? `<ul class="tag-list">${tags}</ul>` : ''}
        <p class="post-item__excerpt">${escapeHtml(post.excerpt)}</p>
      </li>`;
  }

  async function loadIndex() {
    if (index) return index;
    const res = await fetch('search-index.json');
    index = await res.json();
    return index;
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      resultsEl.hidden = true;
      listEl.hidden = false;
      return;
    }
    listEl.hidden = true;
    resultsEl.hidden = false;

    const matches = index.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.searchableText.includes(q) ||
        post.tags.some((tag) => tag.toLowerCase().includes(q))
    );

    resultsEl.innerHTML = matches.length
      ? matches.map(renderResultItem).join('')
      : '<li class="post-item__excerpt">검색 결과가 없습니다.</li>';
  }

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value;
    debounceTimer = setTimeout(async () => {
      await loadIndex();
      runSearch(query);
    }, 150);
  });
})();
