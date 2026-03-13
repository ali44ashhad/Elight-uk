export function withId(doc) {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(withId);
  const id = doc._id?.toString?.() ?? doc.id;
  return { ...doc, id };
}

