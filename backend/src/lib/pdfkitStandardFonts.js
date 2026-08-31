import { createRequire } from 'module';

/**
 * PDFKit 0.20 lazy-loads standard fonts from
 * node_modules/pdfkit/js/standard-fonts/*.cjs. Vercel file tracing does not
 * follow that dynamic require, which 500s POST /api/provider/apply with
 * MODULE_NOT_FOUND Helvetica.cjs.
 *
 * These static requires must stay so the fonts are copied into the function bundle.
 */
const require = createRequire(import.meta.url);
require('pdfkit/standard-fonts/Helvetica');
require('pdfkit/standard-fonts/HelveticaBold');
require('pdfkit/standard-fonts/TimesItalic');
require('pdfkit/standard-fonts/TimesRoman');
