import { cloudinary } from './cloudinary.js';
import { ProviderApplication } from '../models/ProviderApplication.js';
import { formatPartyBBlock, generateCoDealAgreementPdf } from './coDealAgreementPdf.js';

/** Bump this when the PDF layout/assets change so stored Cloudinary files are rebuilt. */
const AGREEMENT_TEMPLATE_VERSION = 5;

/**
 * @param {import('mongoose').Document | { name?: string, companyName?: string, registeredNumber?: string, website?: string, email?: string, address?: string }} user
 */
function snapshotPartyB(user) {
  return {
    name: String(user?.name || '').trim(),
    companyName: String(user?.companyName || '').trim(),
    registeredNumber: String(user?.registeredNumber || '').trim(),
    website: String(user?.website || '').trim(),
    email: String(user?.email || '').trim(),
    address: String(user?.address || '').trim(),
  };
}

function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_URL ||
      (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
  );
}

/**
 * @param {Buffer} buffer
 * @param {string} appId
 */
async function uploadAgreementPdf(buffer, appId) {
  if (!isCloudinaryConfigured()) {
    const err = new Error('Cloudinary is not configured');
    err.statusCode = 500;
    throw err;
  }
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'elite/agreements',
        resource_type: 'raw',
        public_id: `co-deal-${appId}`,
        format: 'pdf',
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

/**
 * @param {import('mongoose').Document} user
 * @param {{ phone?: string, company?: string, message?: string }} [submittedData]
 */
export async function createPendingProviderApplication(user, submittedData = {}) {
  const partyB = snapshotPartyB(user);
  const app = await ProviderApplication.create({
    user: user._id,
    status: 'pending',
    submittedData: {
      phone: submittedData.phone != null ? String(submittedData.phone).trim() : '',
      company: submittedData.company != null ? String(submittedData.company).trim() : partyB.companyName,
      message: submittedData.message != null ? String(submittedData.message).trim() : '',
    },
    agreement: {
      partyB,
      generatedAt: new Date(),
    },
  });

  try {
    await ensureAgreementPdfUploaded(app, user);
  } catch (e) {
    await ProviderApplication.deleteOne({ _id: app._id });
    throw e;
  }

  return app;
}

/**
 * @param {import('mongoose').Document | Record<string, unknown>} app
 * @param {Record<string, unknown> | null} [user]
 */
function resolveAgreementParty(app, user = null) {
  const stored = app?.agreement?.partyB;
  if (stored && (stored.name || stored.address || stored.companyName)) {
    return {
      name: stored.name || user?.name || '',
      companyName: stored.companyName || user?.companyName || '',
      registeredNumber: stored.registeredNumber || user?.registeredNumber || '',
      website: stored.website || user?.website || '',
      email: stored.email || user?.email || '',
      address: stored.address || user?.address || '',
    };
  }
  return snapshotPartyB(user || {});
}

export function needsAgreementRebuild(app) {
  return !app?.agreement?.pdfUrl || Number(app?.agreement?.templateVersion) !== AGREEMENT_TEMPLATE_VERSION;
}

/**
 * Generate the Co-Deal PDF if needed and store it on Cloudinary.
 * @param {import('mongoose').Document} app
 * @param {Record<string, unknown> | null} [user]
 */
export async function ensureAgreementPdfUploaded(app, user = null) {
  if (!needsAgreementRebuild(app)) return app.agreement.pdfUrl;

  const party = resolveAgreementParty(app, user);
  const buffer = await generateCoDealAgreementPdf({
    partyBName: party.name,
    partyBBlock: formatPartyBBlock(party),
    agreementDate: app.createdAt,
  });
  const uploaded = await uploadAgreementPdf(buffer, app._id.toString());
  const pdfUrl = uploaded?.secure_url || uploaded?.url || '';
  if (!pdfUrl) {
    const err = new Error('Failed to upload agreement PDF to Cloudinary');
    err.statusCode = 500;
    throw err;
  }

  if (!app.agreement) app.agreement = {};
  app.agreement.pdfUrl = pdfUrl;
  app.agreement.pdfPublicId = uploaded.public_id || '';
  app.agreement.generatedAt = new Date();
  app.agreement.templateVersion = AGREEMENT_TEMPLATE_VERSION;
  app.markModified('agreement');
  await app.save();
  return pdfUrl;
}
