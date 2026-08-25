function apiBaseUrl() {
  let raw = String(import.meta.env.VITE_API_URL || 'http://localhost:4000').trim().replace(/\/+$/, '');
  if (/^https?:\/\//i.test(raw)) return raw;
  raw = raw.replace(/^https?:/i, '');
  return `http://${raw.replace(/^\/+/, '')}`;
}

const BASE_URL = apiBaseUrl();

/** @type {string | null} */
let authToken = null;
/** @type {string | null} */
let userAuthToken = null;

/**
 * @param {string | null} token
 */
export function setAuthToken(token) {
  authToken = token;
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
}

/**
 * @param {string | null} token
 */
export function setUserAuthToken(token) {
  userAuthToken = token;
}

export function getUserAuthToken() {
  return userAuthToken;
}

export function clearUserAuthToken() {
  userAuthToken = null;
}

/**
 * @typedef {{
 *   headers?: Record<string, string>,
 *   body?: unknown,
 * } & Omit<RequestInit, 'headers' | 'body' | 'method'>} ApiRequestOptions
 */

/**
 * @param {string} method
 * @param {string} path
 * @param {ApiRequestOptions} [options]
 */
export async function request(method, path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const isAdmin = path.includes('/api/admin');
  const isUserAuthedPath =
    path.startsWith('/api/provider') ||
    path === '/api/auth/me' ||
    path === '/api/auth/change-password';
  /** @type {Record<string, string>} */
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (isAdmin && authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  if (!isAdmin && isUserAuthedPath && userAuthToken) {
    headers.Authorization = `Bearer ${userAuthToken}`;
  }

  /** @type {RequestInit} */
  const config = {
    method,
    headers,
  };
  if (options.body !== undefined && typeof options.body === 'object' && options.body !== null && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  } else if (options.body !== undefined) {
    config.body = /** @type {BodyInit} */ (options.body);
  }

  const res = await fetch(url, config);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // leave data null for non-JSON (e.g. 204)
  }

  if (!res.ok) {
    /** @type {Error & { status?: number, data?: unknown }} */
    const err = new Error(data?.error || res.statusText || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

// —— Public API ——

/** GET /api/properties — list (optional query: page, limit) */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getProperties(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/properties${q ? `?${q}` : ''}`);
}

/** GET /api/properties/:id */
/**
 * @param {string} id
 */
export function getProperty(id) {
  return request('GET', `/api/properties/${id}`);
}

/** GET /api/sellers — list (public, for dropdowns / profile) */
export function getSellers() {
  return request('GET', '/api/sellers');
}

/** GET /api/sellers/:id — single seller (public profile) */
/**
 * @param {string} id
 */
export function getSeller(id) {
  return request('GET', `/api/sellers/${id}`);
}

/** POST /api/inquiries — { name, email, phone, budget?, message?, source?, propertyId? } */
/**
 * @param {Record<string, unknown>} body
 */
export function createInquiry(body) {
  return request('POST', '/api/inquiries', { body });
}

/** POST /api/inquiries/draft — partial autosaved inquiry (no required fields) */
/**
 * @param {Record<string, unknown>} body
 */
export function createInquiryDraft(body) {
  return request('POST', '/api/inquiries/draft', { body });
}

/** PATCH /api/inquiries/draft/:id — update draft fields */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function updateInquiryDraft(id, body) {
  return request('PATCH', `/api/inquiries/draft/${id}`, { body });
}

/** POST /api/refunds — refund request form */
/**
 * @param {Record<string, unknown>} body
 */
export function createRefund(body) {
  return request('POST', '/api/refunds', { body });
}

/** POST /api/general-queries — investment property requirement request (IPRR) */
/**
 * @param {Record<string, unknown>} body
 */
export function createGeneralQuery(body) {
  return request('POST', '/api/general-queries', { body });
}

/** POST /api/investors-lounge — homepage popup submissions */
/**
 * @param {Record<string, unknown>} body
 */
export function createInvestorsLoungeSubmission(body) {
  return request('POST', '/api/investors-lounge', { body })
}

// —— User Auth ——

/** POST /api/auth/register — { name, email, password } → { token, user } */
/**
 * @param {Record<string, unknown>} body
 */
export function userRegister(body) {
  return request('POST', '/api/auth/register', { body });
}

/** POST /api/auth/login — { email, password } → { token, user } */
/**
 * @param {Record<string, unknown>} body
 */
export function userLogin(body) {
  return request('POST', '/api/auth/login', { body });
}

/** GET /api/auth/me (requires user auth) */
export function userMe() {
  return request('GET', '/api/auth/me');
}

/** PATCH /api/auth/me */
/**
 * @param {Record<string, unknown>} body
 */
export function userUpdateMe(body) {
  return request('PATCH', '/api/auth/me', { body })
}

/** POST /api/auth/change-password */
/**
 * @param {Record<string, unknown>} body
 */
export function userChangePassword(body) {
  return request('POST', '/api/auth/change-password', { body })
}

/** POST /api/auth/me/image — FormData with 'image' file */
/**
 * @param {FormData} formData
 */
export function userUploadMeImage(formData) {
  const url = `${BASE_URL}/api/auth/me/image`
  /** @type {Record<string, string>} */
  const headers = {}
  if (userAuthToken) headers.Authorization = `Bearer ${userAuthToken}`
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  }).then(async (res) => {
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // ignore non-JSON
    }
    if (!res.ok) {
      /** @type {Error & { status?: number, data?: unknown }} */
      const err = new Error(data?.error || res.statusText || 'Upload failed')
      err.status = res.status
      err.data = data
      throw err
    }
    return data
  })
}

// —— Provider (user auth required) ——

/** POST /api/provider/apply */
/**
 * @param {Record<string, unknown>} [body]
 */
export function providerApply(body = {}) {
  return request('POST', '/api/provider/apply', { body });
}

/** GET /api/provider/me */
export function providerMe() {
  return request('GET', '/api/provider/me');
}

/** GET /api/provider/properties */
export function providerGetMyProperties() {
  return request('GET', '/api/provider/properties');
}

/** GET /api/provider/properties/:id */
/**
 * @param {string} id
 */
export function providerGetMyProperty(id) {
  return request('GET', `/api/provider/properties/${id}`);
}

/** POST /api/provider/properties */
/**
 * @param {Record<string, unknown>} body
 */
export function providerCreateProperty(body) {
  return request('POST', '/api/provider/properties', { body });
}

/** POST /api/provider/properties/:id/images — FormData with 'images' file(s) */
/**
 * @param {string} propertyId
 * @param {FormData} formData
 */
export function providerUploadPropertyImages(propertyId, formData) {
  const url = `${BASE_URL}/api/provider/properties/${propertyId}/images`
  /** @type {Record<string, string>} */
  const headers = {}
  if (userAuthToken) headers.Authorization = `Bearer ${userAuthToken}`
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  }).then(async (res) => {
    const text = await res.text()
    let data = null
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      // ignore non-JSON responses
    }
    if (!res.ok) {
      /** @type {Error & { status?: number, data?: unknown }} */
      const err = new Error(data?.error || res.statusText || 'Upload failed')
      err.status = res.status
      err.data = data
      throw err
    }
    return data
  })
}

/** DELETE /api/provider/properties/:propertyId/images/:imageId */
/**
 * @param {string} propertyId
 * @param {string} imageId
 */
export function providerDeletePropertyImage(propertyId, imageId) {
  return request('DELETE', `/api/provider/properties/${propertyId}/images/${imageId}`);
}

/** PATCH /api/provider/properties/:id */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function providerUpdateProperty(id, body) {
  return request('PATCH', `/api/provider/properties/${id}`, { body });
}

// —— Admin Auth ——

/** POST /api/admin/login — { email, password } → { token, admin } */
/**
 * @param {Record<string, unknown>} body
 */
export function login(body) {
  return request('POST', '/api/admin/login', { body });
}

/** GET /api/admin/me (requires auth) */
export function getMe() {
  return request('GET', '/api/admin/me');
}

// —— Admin Provider Applications (require auth) ——

/** GET /api/admin/provider-applications */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminProviderApplications(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString()
  return request('GET', `/api/admin/provider-applications${q ? `?${q}` : ''}`)
}

/** PATCH /api/admin/provider-applications/:id */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function reviewAdminProviderApplication(id, body) {
  return request('PATCH', `/api/admin/provider-applications/${id}`, { body })
}

// —— Admin Properties (require auth) ——

/** GET /api/admin/properties — list (optional: page, limit) */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminProperties(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/admin/properties${q ? `?${q}` : ''}`);
}

/** GET /api/admin/properties/:id */
/**
 * @param {string} id
 */
export function getAdminProperty(id) {
  return request('GET', `/api/admin/properties/${id}`);
}

/** POST /api/admin/properties — create */
/**
 * @param {Record<string, unknown>} body
 */
export function createProperty(body) {
  return request('POST', '/api/admin/properties', { body });
}

/** PATCH /api/admin/properties/:id */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function updateProperty(id, body) {
  return request('PATCH', `/api/admin/properties/${id}`, { body });
}

/** DELETE /api/admin/properties/:id */
/**
 * @param {string} id
 */
export function deleteProperty(id) {
  return request('DELETE', `/api/admin/properties/${id}`);
}

/** POST /api/admin/properties/:id/images — FormData with 'images' file(s) */
/**
 * @param {string} propertyId
 * @param {FormData} formData
 */
export function uploadPropertyImages(propertyId, formData) {
  const url = `${BASE_URL}/api/admin/properties/${propertyId}/images`;
  /** @type {Record<string, string>} */
  const headers = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  }).then(async (res) => {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // ignore non-JSON responses
    }
    if (!res.ok) {
      /** @type {Error & { status?: number, data?: unknown }} */
      const err = new Error(data?.error || res.statusText || 'Upload failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  });
}

/** DELETE /api/admin/properties/:propertyId/images/:imageId */
/**
 * @param {string} propertyId
 * @param {string} imageId
 */
export function deletePropertyImage(propertyId, imageId) {
  return request('DELETE', `/api/admin/properties/${propertyId}/images/${imageId}`);
}

// —— Admin Sellers (require auth) ——

/** GET /api/admin/sellers */
export function getAdminSellers() {
  return request('GET', '/api/admin/sellers');
}

/** POST /api/admin/sellers — { name } */
/**
 * @param {Record<string, unknown>} body
 */
export function createSeller(body) {
  return request('POST', '/api/admin/sellers', { body });
}

/** GET /api/admin/sellers/:id */
/**
 * @param {string} id
 */
export function getAdminSeller(id) {
  return request('GET', `/api/admin/sellers/${id}`);
}

/** PATCH /api/admin/sellers/:id */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function updateSeller(id, body) {
  return request('PATCH', `/api/admin/sellers/${id}`, { body });
}

/** DELETE /api/admin/sellers/:id */
/**
 * @param {string} id
 */
export function deleteSeller(id) {
  return request('DELETE', `/api/admin/sellers/${id}`);
}

/** GET /api/admin/users — optional: page, limit, role=all|buyers|providers, q=search */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminUsers(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/admin/users${q ? `?${q}` : ''}`);
}

/** PATCH /api/admin/users/:id — { isActive: boolean } */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function patchAdminUser(id, body) {
  return request('PATCH', `/api/admin/users/${id}`, { body });
}

/** POST /api/admin/sellers/:id/image — FormData with 'image' file */
/**
 * @param {string} sellerId
 * @param {FormData} formData
 */
export function uploadSellerImage(sellerId, formData) {
  const url = `${BASE_URL}/api/admin/sellers/${sellerId}/image`;
  /** @type {Record<string, string>} */
  const headers = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  return fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  }).then(async (res) => {
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      // ignore non-JSON responses
    }
    if (!res.ok) {
      /** @type {Error & { status?: number, data?: unknown }} */
      const err = new Error(data?.error || res.statusText || 'Upload failed');
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  });
}

// —— Admin Deals (require auth) ——

/** GET /api/admin/deals — list (optional: page, limit, status) */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminDeals(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/admin/deals${q ? `?${q}` : ''}`);
}

/** PATCH /api/admin/deals/:id — body: { action?: 'record_payment'|'mark_refunded'|'mark_sold', ...fields } */
/**
 * @param {string} id
 * @param {Record<string, unknown>} body
 */
export function updateDeal(id, body) {
  return request('PATCH', `/api/admin/deals/${id}`, { body });
}

/** POST /api/admin/deals — create deal from inquiry */
/**
 * @param {string} inquiryId
 */
export function createAdminDealFromInquiry(inquiryId) {
  return request('POST', '/api/admin/deals', { body: { inquiryId } });
}

// —— Admin Inquiries (require auth) ——

/** GET /api/admin/inquiries */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminInquiries(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/admin/inquiries${q ? `?${q}` : ''}`);
}

/** GET /api/admin/general-queries */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminGeneralQueries(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString();
  return request('GET', `/api/admin/general-queries${q ? `?${q}` : ''}`);
}

/** GET /api/admin/investors-lounge */
/**
 * @param {Record<string, string | number | boolean | undefined>} [params]
 */
export function getAdminInvestorsLounge(params = {}) {
  const q = new URLSearchParams(/** @type {Record<string, string>} */ (params)).toString()
  return request('GET', `/api/admin/investors-lounge${q ? `?${q}` : ''}`)
}

// —— Health (optional) ——
export function health() {
  return request('GET', '/api/health');
}
