import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.join(__dirname, '../assets');
const SIGNATURE_FONT_PATH = path.join(ASSETS_DIR, 'HomemadeApple-Regular.ttf');
const LOGO_PATH = path.join(ASSETS_DIR, 'logo.png');

const PAGE_REF = '7823/364247 - v1';
const PEN_INK = '#222222';

/**
 * @param {Date | string | number | null | undefined} dateInput
 */
function formatOrdinalDate(dateInput) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput || Date.now());
  if (Number.isNaN(date.getTime())) return '';
  const day = date.getDate();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const v = day % 100;
  const suffix = v >= 11 && v <= 13 ? 'th' : { 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th';
  return `${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * @param {{
 *   name?: string,
 *   companyName?: string,
 *   registeredNumber?: string,
 *   website?: string,
 *   email?: string,
 *   address?: string,
 * }} party
 */
export function formatPartyBBlock(party = {}) {
  const lines = [];
  if (party.name) lines.push(String(party.name).trim());
  if (party.companyName) lines.push(String(party.companyName).trim());
  if (party.registeredNumber) lines.push(`Company Number: ${String(party.registeredNumber).trim()}`);
  if (party.address) {
    String(party.address)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((line) => lines.push(line));
  }
  if (party.email) lines.push(String(party.email).trim());
  if (party.website) lines.push(String(party.website).trim());
  return lines.join('\n');
}

/**
 * @param {string} text
 * @param {string} name
 */
function withPartyB(text, name) {
  return String(text)
    .replace(/\[NAME OF PARTY B\]/g, name)
    .replace(/\[Party B\]/g, name)
    .replace(/Party B/g, name);
}

function contentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

function ensureSpace(doc, needed) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

function addParagraph(doc, text, { bold = false, size = 10, after = 8, indent = 0 } = {}) {
  const left = doc.page.margins.left + indent;
  const width = contentWidth(doc) - indent;
  doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor('#111111');
  const height = doc.heightOfString(text, { width, lineGap: 1.5 });
  ensureSpace(doc, height + after + 2);
  doc.text(text, left, doc.y, { width, align: 'left', lineGap: 1.5 });
  doc.y += after;
}

function addClause(doc, number, text) {
  const left = doc.page.margins.left;
  const numW = 32;
  const gap = 8;
  const textW = contentWidth(doc) - numW - gap;
  doc.font('Helvetica').fontSize(10).fillColor('#111111');
  const height = doc.heightOfString(text, { width: textW, lineGap: 1.5 });
  ensureSpace(doc, height + 8);
  const y = doc.y;
  doc.text(number, left, y, { width: numW, lineBreak: false });
  doc.text(text, left + numW + gap, y, { width: textW, align: 'left', lineGap: 1.5 });
  doc.y += 6;
}

function addHeading(doc, text) {
  const label = String(text).replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
  ensureSpace(doc, 28);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#111111');
  doc.text(label, doc.page.margins.left, doc.y, { width: contentWidth(doc) });
  doc.y += 8;
}

function resolveLogoPath() {
  return fs.existsSync(LOGO_PATH) ? LOGO_PATH : null;
}

function drawBrandLogo(doc) {
  const logoPath = resolveLogoPath();
  const boxW = 210;
  const boxH = 72;
  const x = (doc.page.width - boxW) / 2;
  const y = 26;
  if (!logoPath) {
    doc.y = y + boxH + 12;
    return;
  }
  try {
    doc.image(logoPath, x, y, { fit: [boxW, boxH], align: 'center', valign: 'center' });
  } catch (e) {
    console.error('[pdf.logo]', e);
  }
  doc.y = y + boxH + 18;
}

/**
 * Script signatures look right as Title Case (John Smith), not ALL CAPS or lowercase.
 * @param {string} name
 */
function formatSignatureName(name) {
  return String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) =>
      word
        .split('-')
        .map((part) => {
          if (!part) return part;
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        })
        .join('-')
    )
    .join(' ');
}

/**
 * Pen-style signature sitting just above the dotted line.
 * @param {import('pdfkit')} doc
 * @param {string} name
 * @param {number} lineY
 */
function drawPenSignature(doc, name, lineY) {
  const sigName = formatSignatureName(name) || 'Party B';
  const left = doc.page.margins.left + 2;
  const y = lineY - 22;
  let fontReady = false;
  if (fs.existsSync(SIGNATURE_FONT_PATH)) {
    try {
      doc.registerFont('PenSignature', SIGNATURE_FONT_PATH);
      fontReady = true;
    } catch {
      fontReady = false;
    }
  }

  try {
    if (fontReady) {
      const size = sigName.length > 18 ? 18 : 22;
      doc.font('PenSignature').fontSize(size).fillColor(PEN_INK);
      doc.text(sigName, left, y, { lineBreak: false });
    } else {
      doc.font('Times-Italic').fontSize(16).fillColor(PEN_INK);
      doc.text(sigName, left, y + 4, { lineBreak: false });
    }
  } catch {
    doc.font('Times-Italic').fontSize(16).fillColor(PEN_INK);
    doc.text(sigName, left, y + 4, { lineBreak: false });
  }
  doc.font('Helvetica').fillColor('#111111');
}

function addFooters(doc) {
  const range = doc.bufferedPageRange();
  for (let i = 0; i < range.count; i += 1) {
    doc.switchToPage(range.start + i);
    const { bottom } = doc.page.margins;
    doc.page.margins.bottom = 0;
    const y = doc.page.height - 36;
    doc.font('Helvetica').fontSize(8).fillColor('#9ca3af');
    doc.text(PAGE_REF, doc.page.margins.left, y, { lineBreak: false });
    doc.fontSize(10).fillColor('#374151');
    doc.text(String(i + 1), 0, y - 1, { width: doc.page.width, align: 'center', lineBreak: false });
    doc.page.margins.bottom = bottom;
  }
}

function addDottedLine(doc, width = 280) {
  const y = doc.y + 18;
  const left = doc.page.margins.left;
  doc.save();
  doc.strokeColor('#111111').lineWidth(0.8).dash(2.2, { space: 2.2 });
  doc.moveTo(left, y).lineTo(left + width, y).stroke();
  doc.restore();
  return y;
}

/**
 * @param {{
 *   partyBName: string,
 *   partyBBlock: string,
 *   agreementDate: Date | string | number,
 * }} opts
 * @returns {Promise<Buffer>}
 */
export function generateCoDealAgreementPdf({ partyBName, partyBBlock, agreementDate }) {
  const name = String(partyBName || '').trim() || 'Party B';
  const displayName = formatSignatureName(name) || name;
  const addressBlock = String(partyBBlock || '').trim() || name;
  const dateLabel = formatOrdinalDate(agreementDate);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      bufferPages: true,
      compress: false,
      margins: { top: 72, bottom: 52, left: 72, right: 72 },
    });

    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    drawBrandLogo(doc);

    addParagraph(
      doc,
      'This Agreement shall commence on the date of execution and continue until terminated by either party upon 30 days\' written notice. This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, negotiations and understandings.  No variation of this Agreement shall be effective unless made in writing and signed by both parties.'
    );

    addParagraph(
      doc,
      'Adamas Aureum Deal Sourcing Ltd, trading as Globcal Properties (Company Number: 17174020 Registered Office: 2nd Floor College House, 17 King Edwards Road, Ruislip, London, United Kingdom, HA4 7AE',
      { bold: true, after: 12 }
    );

    addParagraph(doc, addressBlock, { after: 12 });

    addParagraph(
      doc,
      withPartyB(
        '[Party B] warrants that it holds and shall maintain all licences, registrations, permissions and insurance required to undertake its business and shall comply with all applicable laws and regulations.  [Party B] warrants that it possesses all necessary authority, permissions and rights to provide each Property Deal to Globcal Properties for marketing and introduction purposes.  [Party B] may not assign, transfer or subcontract any rights or obligations under this Agreement without the prior written consent of Globcal Properties.  [Party B] shall not directly or indirectly solicit, approach or enter into business arrangements with any client introduced by Globcal Properties except through Globcal Properties or with its prior written consent.',
        name
      ),
      { after: 14 }
    );

    addParagraph(doc, dateLabel, { after: 4 });
    addParagraph(doc, `Dear ${displayName}`, { after: 12 });

    addParagraph(doc, 'CO-DEAL SOURCING AGREEMENT', { bold: true, size: 11, after: 10 });

    addHeading(doc, '1. BACKGROUND');
    addClause(
      doc,
      '1.1',
      withPartyB(
        'Globcal Properties runs a deal sourcing business and is willing to make introductions on behalf of [Party B] to potential property investors ("Property Deals") to sell on to members of Globcal Properties\' client list.',
        name
      )
    );
    addClause(
      doc,
      '1.2',
      withPartyB(
        '"Property Deal" means any property investment opportunity including without limitation freehold or leasehold acquisitions, assignments, options, developments, rent-to-rent opportunities, portfolio sales, joint ventures, commercial transactions and any other real estate related opportunity introduced by [Party B] .',
        name
      )
    );
    addClause(
      doc,
      '1.3',
      '"Introduced Client" Client means any individual, company, partnership, trust or other entity introduced directly or indirectly by Globcal Properties, together with any connected person, nominee or associated undertaking of that party.'
    );
    addClause(
      doc,
      '1.4',
      withPartyB(
        'Commission shall become payable where a Property Deal introduced by [Party B] is purchased, reserved, exchanged or otherwise transacted by a client introduced/identified by Globcal Properties, [Party B] shall pay Globcal Properties the greater of:',
        name
      )
    );
    addParagraph(doc, '(a) £500; or', { indent: 40, after: 4 });
    addParagraph(
      doc,
      withPartyB(
        '(b) 15% of all deal sourcing fees, introduction fees, assignment fees, commissions or other sums payable to [Party B] in connection with that Property Deal.',
        name
      ),
      { indent: 40, after: 8 }
    );
    addParagraph(
      doc,
      'Commission shall remain payable where a transaction is entered into with any purchaser introduced by Globcal Properties within 24 months of the date of introduction.',
      { indent: 40, after: 8 }
    );
    addParagraph(
      doc,
      withPartyB(
        'Commission shall remain payable where an Introduced Client purchases directly or indirectly through any connected person, company, nominee, trust, partnership or special purpose vehicle. Such payment shall be due within 14 days of Party B receiving payment from the client.',
        name
      ),
      { indent: 40, after: 8 }
    );
    addParagraph(
      doc,
      withPartyB(
        'Any sum outstanding after the due date shall accrue interest at 8% per annum above the Bank of England base rate, calculated daily until paid. Party B shall reimburse Globcal Properties for all reasonable legal and debt recovery costs incurred in enforcing this Agreement.',
        name
      ),
      { indent: 40, after: 8 }
    );
    addClause(
      doc,
      '1.5',
      withPartyB(
        '[Party B] shall notify Globcal Properties within 3 business days of any reservation, exchange, completion or other transaction involving a client introduced by Globcal Properties.',
        name
      )
    );
    addClause(
      doc,
      '1.6',
      withPartyB(
        'Upon reasonable notice, Party B shall provide documentation reasonably required to verify any fees received in relation to a Property Deal involving an Introduced Client.',
        name
      )
    );
    addClause(
      doc,
      '1.7',
      withPartyB(
        '[Party B] shall not directly or indirectly circumvent Globcal Properties in relation to any client introduced by Globcal Properties. If a transaction is concluded with such client within 24 months of introduction, the commission set out in this agreement shall remain payable.',
        name
      )
    );
    addClause(
      doc,
      '1.8',
      'For the purposes of this Agreement, a sale shall be deemed facilitated by Globcal Properties where Globcal Properties introduces, markets, advertises, refers, presents, negotiates or otherwise assists in connecting a Property Deal with a purchaser.'
    );
    addClause(
      doc,
      '1.9',
      'In the event that Globcal Properties is not able to facilitate a sale on the Property Deal to a client or that any attempt to sell on the Property Deal falls through for any reason, no flat fee or commission payment will be payable or owed.'
    );

    addHeading(doc, '2. EXCLUSIVITY AND FIRST REFUSAL');
    addClause(
      doc,
      '2.1',
      withPartyB(
        '[Party B] shall upload to date Property Deals to Globcal Properties platform and shall not market such Property Deals through any other party for a period of 20 hours following delivery of the deal information. If Globcal Properties declines the opportunity or does not respond within that period, [Party B] may market the Property Deal elsewhere.',
        name
      )
    );
    addClause(
      doc,
      '2.2',
      withPartyB(
        'On or after 28th August 2026, upon submission of a Property Deal to Globcal Properties, [Party B] grants Globcal Properties an exclusive right to market that Property Deal for a period of 72 hours from submission.',
        name
      )
    );
    addClause(
      doc,
      '2.3',
      withPartyB(
        'Where [Party B] breaches the exclusivity provisions, [Party B] shall immediately become liable to pay the greater of £500 or the commission otherwise payable under this Agreement.',
        name
      )
    );

    addHeading(doc, '3. ACCURACY AND DUE DILIGENCE');
    addClause(
      doc,
      '3.1',
      withPartyB(
        '[Party B] warrants that all information supplied to Globcal Properties is accurate, complete and not misleading in any material respect and agrees to indemnify Globcal Properties against any loss, claim, liability, cost or expense arising from any breach of this warranty.',
        name
      )
    );
    addClause(
      doc,
      '3.2',
      withPartyB(
        '[Party B] shall indemnify and keep indemnified Globcal Properties against all losses, damages, claims, proceedings, liabilities, costs and expenses arising from inaccurate, misleading or incomplete information supplied by [Party B].',
        name
      )
    );

    addHeading(doc, '4. CONFIDENTIALITY');
    addClause(doc, '4.1', withPartyB('[Party B] must:', name));
    addClause(
      doc,
      '4.1.1',
      'keep all details of any Property Deal confidential ("Confidential Information"); and'
    );
    addClause(
      doc,
      '4.1.2',
      withPartyB(
        'not publish any of the Confidential Information, in whole or in part, unless Globcal Properties provides prior written consent or to disclosure. [Party B] from its obligations in accordance with Clause 2.1 ; to disclosure. [Party B] from its obligations in accordance with Clause 2.1 ;',
        name
      )
    );
    addClause(
      doc,
      '4.1.3',
      'until consent is given in accordance with clause 4.1.2 keep the Confidential Information secret and confidential.'
    );

    addHeading(doc, '5. GOVERNING LAW AND JURISDICTION');
    addClause(
      doc,
      '5.1',
      'This letter agreement and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with it or its subject matter or formation shall be governed by and construed in accordance with the law of England and Wales.'
    );
    addClause(
      doc,
      '5.2',
      'Each party irrevocably agrees that the courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with this letter agreement or its subject matter or formation.'
    );

    addParagraph(
      doc,
      'Please sign and return a PDF copy of this letter agreement if you agree to its terms.',
      { after: 8 }
    );
    addParagraph(doc, 'Yours faithfully,', { after: 8 });

    ensureSpace(doc, 70);
    addDottedLine(doc, 290);
    doc.y += 26;
    addParagraph(doc, 'Signed on behalf of:  Globcal Properties', { after: 16 });

    addParagraph(doc, 'We acknowledge receipt and agree to the terms of this letter agreement:', { after: 6 });

    ensureSpace(doc, 110);
    const lineY = addDottedLine(doc, 290);
    drawPenSignature(doc, displayName, lineY);

    doc.y = lineY + 12;
    addParagraph(doc, `Signed by ${displayName}`, { after: 2 });
    addParagraph(doc, `For and on behalf of ${displayName}`, { after: 8 });
    addParagraph(doc, `Date ${dateLabel}`, { after: 4 });

    addFooters(doc);
    doc.end();
  });
}