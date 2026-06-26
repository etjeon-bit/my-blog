import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { POSTS_DIR } from './paths.js';

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdown(body) {
  return body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[.*?\]\(.*?\)/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#>*_~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function makeExcerpt(plainText, maxLength = 160) {
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.slice(0, maxLength).trim()}…`;
}

export function parseAllPosts() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));

  const posts = files.map((filename) => {
    const filePath = path.join(POSTS_DIR, filename);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);

    if (!data.title || !data.date) {
      throw new Error(
        `포스트 "${filename}"에 필수 프런트매터(title, date)가 없습니다.`
      );
    }

    const slug = data.slug
      ? slugify(String(data.slug))
      : slugify(path.basename(filename, '.md'));
    const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
    const html = marked.parse(content);
    const plainText = stripMarkdown(content);
    const date =
      data.date instanceof Date
        ? data.date.toISOString().slice(0, 10)
        : String(data.date);

    return {
      slug,
      title: String(data.title),
      date,
      tags,
      html,
      excerpt: makeExcerpt(plainText),
      searchableText: plainText.toLowerCase(),
    };
  });

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  return posts;
}
