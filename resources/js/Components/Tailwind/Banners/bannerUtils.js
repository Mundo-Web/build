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
  
  // Legacy or specific check: if it looks like a system image, keep it? 
  // But controller saves to 'banner'. Let's trust the default.

  // Si no tiene prefijo de ruta conocida, asumimos que es una imagen de banner
  return `/storage/images/banner/${sanitized}`;
};
