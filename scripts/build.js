import fs from 'node:fs';
import path from 'node:path';
import {
  DIST_DIR,
  ASSETS_SRC_DIR,
  ASSETS_DIST_DIR,
  POSTS_DIST_DIR,
  TAGS_DIST_DIR,
} from './lib/paths.js';
import { parseAllPosts } from './lib/parsePosts.js';
import { homePage, postPage, tagPage } from './lib/templates.js';

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function build() {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.mkdirSync(POSTS_DIST_DIR, { recursive: true });
  fs.mkdirSync(TAGS_DIST_DIR, { recursive: true });

  copyDir(ASSETS_SRC_DIR, ASSETS_DIST_DIR);

  const posts = parseAllPosts();
  const tags = [...new Set(posts.flatMap((post) => post.tags))].sort();

  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), homePage(posts, tags));

  for (const post of posts) {
    fs.writeFileSync(
      path.join(POSTS_DIST_DIR, `${post.slug}.html`),
      postPage(post)
    );
  }

  for (const tag of tags) {
    const tagPosts = posts.filter((post) => post.tags.includes(tag));
    fs.writeFileSync(
      path.join(TAGS_DIST_DIR, `${tag}.html`),
      tagPage(tag, tagPosts)
    );
  }

  const searchIndex = posts.map(
    ({ slug, title, excerpt, tags: postTags, date, searchableText }) => ({
      slug,
      title,
      excerpt,
      tags: postTags,
      date,
      searchableText,
    })
  );
  fs.writeFileSync(
    path.join(DIST_DIR, 'search-index.json'),
    JSON.stringify(searchIndex)
  );

  console.log(`빌드 완료: ${posts.length}개 글, ${tags.length}개 태그 → ${DIST_DIR}`);
}

build();
