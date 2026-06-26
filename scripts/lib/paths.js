import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');

export const POSTS_DIR = path.join(ROOT_DIR, 'posts');
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const ASSETS_SRC_DIR = path.join(ROOT_DIR, 'assets');
export const ASSETS_DIST_DIR = path.join(DIST_DIR, 'assets');
export const POSTS_DIST_DIR = path.join(DIST_DIR, 'posts');
export const TAGS_DIST_DIR = path.join(DIST_DIR, 'tags');
