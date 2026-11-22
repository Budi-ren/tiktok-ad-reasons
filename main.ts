// TikTok ad entry for make.fun bounty bring-the-humans-03 ("3 REASONS").
// Node 22, standard library only. Copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it. The entry is the video
// itself: an original short vertical ad for make.fun, posted publicly on
// TikTok from @Approximatelly6 with the bounty's line and our play code in
// its caption. VIDEO.json names the video; the house reads its views.
//
// The ad carries make.fun's brand badge from its first frame and ends on
// make.fun's referral end card with our own referral code (jtt32yyc) typed
// in its field — both from the press pack at https://make.fun/press/manifest.json
// (guide: https://make.fun/press/llms.txt), used as they are. This repository
// holds no copy of the press files.
//
// The VIDEO.json shipped here holds a placeholder address, so the gate
// refuses it as it stands. Replace it with the real TikTok address before
// submitting. This program refuses a placeholder outright (exit 1) so no
// submission can go out with a fake URL.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const HANDLE = '@Approximatelly6';

const src = join(BOT_DIR, 'VIDEO.json');
if (!existsSync(src)) {
  console.error(`VIDEO.json not found in ${BOT_DIR}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(readFileSync(src, 'utf8'));
} catch (err) {
  console.error(`VIDEO.json is not valid JSON: ${(err as Error).message}`);
  process.exit(1);
}

const url = data.url;
const m = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._]+)\/video\/(\d+)$/.exec(url ?? '');
if (!m) {
  console.error('VIDEO.json url must be a full TikTok video address: https://www.tiktok.com/@<handle>/video/<id>');
  process.exit(1);
}
if (m[1] !== HANDLE.slice(1)) {
  console.error(`VIDEO.json handle must be ${HANDLE}, got @${m[1]}`);
  process.exit(1);
}
if (/^0+$/.test(m[2])) {
  console.error('VIDEO.json still holds the placeholder video id — replace it with the posted video’s id first.');
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
copyFileSync(src, join(OUTPUT_DIR, 'VIDEO.json'));
console.log(`OK: ${url} -> ${join(OUTPUT_DIR, 'VIDEO.json')}`);
