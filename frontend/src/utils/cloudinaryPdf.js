/**
 * @param {string | null | undefined} url
 * @param {{ download?: boolean }} [opts]
 */
function cloudinaryPdfHref(url, opts = {}) {
  const src = String(url || '').trim()
  if (!src) return ''
  if (!opts.download) return src
  if (src.includes('fl_attachment')) return src
  return src.replace('/upload/', '/upload/fl_attachment/')
}

/**
 * Open a Cloudinary-hosted PDF in a new tab.
 * @param {string | null | undefined} url
 * @param {{ download?: boolean }} [opts]
 */
export function openCloudinaryPdf(url, opts = {}) {
  const href = cloudinaryPdfHref(url, opts)
  if (!href) {
    throw new Error('Agreement PDF is not available')
  }
  window.open(href, '_blank', 'noopener,noreferrer')
}
