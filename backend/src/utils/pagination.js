export function parsePagination(query) {
  const pageRaw = query?.page;
  const limitRaw = query?.limit;
  if (pageRaw == null && limitRaw == null) return null;

  const page = Math.max(1, Number(pageRaw) || 1);
  const limit = Math.min(100, Math.max(1, Number(limitRaw) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

