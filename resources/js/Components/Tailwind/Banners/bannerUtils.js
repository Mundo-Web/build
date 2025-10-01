export const resolveSystemAsset = (value) => {
  if (!value) return "";

  const sanitized = String(value).trim();
  if (sanitized === "") return "";

  if (/^(https?:)?\/\//i.test(sanitized)) {
    return sanitized;
  }

  if (sanitized.startsWith("blob:")) {
    return sanitized;
  }

  if (sanitized.startsWith("data:")) {
    return sanitized;
  }

  if (sanitized.startsWith("/")) {
    return sanitized;
  }

  return `/storage/images/system/${sanitized}`;
};
