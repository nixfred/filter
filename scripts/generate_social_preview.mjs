// Generate the icon set and social preview from original project artwork
// (REL005). Run manually when the artwork changes:
//   node scripts/generate_social_preview.mjs
// Requires sharp. The output PNGs are committed to public/.
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const BG = '#070b14';

// The mark: a galaxy disc with one transmitting point and its light shells,
// the same language as the favicon (Observatory Elegy, docs/ART_DIRECTION.md).
function markSvg(size) {
  const c = size / 2;
  const stars = [];
  // A deterministic sparse starfield so the art is reproducible.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  for (let i = 0; i < Math.round(size / 6); i++) {
    const r = size * 0.46 * Math.sqrt(rand());
    const a = rand() * Math.PI * 2;
    const x = c + r * Math.cos(a);
    const y = c + r * Math.sin(a);
    const rad = 0.4 + rand() * 1.1;
    const fill = rand() < 0.3 ? '#f5f7ff' : '#6fa8c9';
    stars.push(
      `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${fill}" fill-opacity="${(0.3 + rand() * 0.6).toFixed(2)}"/>`,
    );
  }
  const sx = c - size * 0.02;
  const sy = c - size * 0.08;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${BG}"/>
  ${stars.join('\n  ')}
  <circle cx="${sx}" cy="${sy}" r="${size * 0.012}" fill="#b58ff0"/>
  <circle cx="${sx}" cy="${sy}" r="${size * 0.09}" fill="none" stroke="#b58ff0" stroke-opacity="0.5" stroke-width="${size * 0.004}"/>
  <circle cx="${sx}" cy="${sy}" r="${size * 0.17}" fill="none" stroke="#b58ff0" stroke-opacity="0.25" stroke-width="${size * 0.004}"/>
  <circle cx="${sx}" cy="${sy}" r="${size * 0.25}" fill="none" stroke="#b58ff0" stroke-opacity="0.12" stroke-width="${size * 0.004}"/>
</svg>`;
}

async function png(svg, width, height, out) {
  await sharp(Buffer.from(svg)).resize(width, height).png().toFile(out);
  console.log('wrote', out);
}

// Icons.
await png(markSvg(192), 192, 192, 'public/icon_192.png');
await png(markSvg(512), 512, 512, 'public/icon_512.png');
await png(markSvg(180), 180, 180, 'public/apple_touch_icon.png');

// Social preview: 1200x630 with the mark on the left and the title on the
// right (P002 fallback: generated galaxy render with the title treatment).
const socialSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>
  <g transform="translate(0,-285)">${markSvg(1200)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '')}</g>
  <text x="80" y="330" font-family="Georgia, serif" font-size="88" fill="#f5f7ff" letter-spacing="6">THE GREAT FILTER</text>
  <text x="82" y="390" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#9aa7c2">Build a galaxy. Seed the stars. See who survives long enough to be heard.</text>
  <text x="82" y="560" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#5c6785">filter.nixfred.com  .  a NixFred LABS project</text>
</svg>`;
writeFileSync('public/social_preview.svg', socialSvg);
await png(socialSvg, 1200, 630, 'public/social_preview.png');
