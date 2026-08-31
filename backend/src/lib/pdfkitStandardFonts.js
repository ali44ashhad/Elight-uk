import { existsSync } from 'node:fs';
import Module, { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const requireVendor = createRequire(import.meta.url);
requireVendor('../vendor/pdfkit-standard-fonts/Helvetica.cjs');
requireVendor('../vendor/pdfkit-standard-fonts/HelveticaBold.cjs');
requireVendor('../vendor/pdfkit-standard-fonts/TimesItalic.cjs');
requireVendor('../vendor/pdfkit-standard-fonts/TimesRoman.cjs');
requireVendor('../vendor/pdfkit-standard-fonts/chunks/standardGlyphNames-DNHAb7rp.cjs');

/**
 * PDFKit 0.20 lazy-requires files under node_modules/pdfkit/js/standard-fonts.
 * Vercel file tracing copies pdfkit's package.json but not those font modules,
 * which 500s POST /api/provider/apply with MODULE_NOT_FOUND Helvetica.cjs.
 *
 * Redirect those lookups to copies we ship in src/vendor (traced via import.meta.url).
 */
const vendorDir = fileURLToPath(new URL('../vendor/pdfkit-standard-fonts/', import.meta.url));

void fileURLToPath(new URL('../vendor/pdfkit-standard-fonts/Helvetica.cjs', import.meta.url));
void fileURLToPath(new URL('../vendor/pdfkit-standard-fonts/HelveticaBold.cjs', import.meta.url));
void fileURLToPath(new URL('../vendor/pdfkit-standard-fonts/TimesItalic.cjs', import.meta.url));
void fileURLToPath(new URL('../vendor/pdfkit-standard-fonts/TimesRoman.cjs', import.meta.url));
void fileURLToPath(
  new URL('../vendor/pdfkit-standard-fonts/chunks/standardGlyphNames-DNHAb7rp.cjs', import.meta.url)
);

function mapPdfkitStandardFont(request) {
  const req = String(request ?? '').replace(/\\/g, '/');
  let fileName = '';
  const hashPrefix = '#standard-fonts/';
  const hashIdx = req.indexOf(hashPrefix);
  if (hashIdx !== -1) {
    fileName = req.slice(hashIdx + hashPrefix.length);
  } else {
    const marker = '/pdfkit/js/standard-fonts/';
    const markerIdx = req.indexOf(marker);
    if (markerIdx !== -1) fileName = req.slice(markerIdx + marker.length);
  }
  if (!fileName) return null;
  fileName = fileName.split('?')[0];
  if (!fileName.endsWith('.cjs')) fileName = `${fileName}.cjs`;
  if (fileName.includes('..')) return null;
  const mapped = path.resolve(vendorDir, fileName);
  const vendorRoot = path.resolve(vendorDir);
  if (!mapped.startsWith(vendorRoot)) return null;
  return existsSync(mapped) ? mapped : null;
}

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  const mapped = mapPdfkitStandardFont(request);
  if (mapped) return mapped;
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
