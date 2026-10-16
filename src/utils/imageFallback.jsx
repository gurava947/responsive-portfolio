export function createImageFallback(title, category, caption) {
  const escapeXml = (text) => text.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character]);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 520">
      <defs>
        <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#edf4df"/>
          <stop offset="1" stop-color="#d2e4ad"/>
        </linearGradient>
      </defs>
      <rect width="900" height="520" fill="url(#paper)"/>
      <circle cx="760" cy="90" r="180" fill="#ffffff" fill-opacity=".35"/>
      <rect x="75" y="72" width="750" height="376" rx="24" fill="#ffffff" fill-opacity=".6"/>
      <text x="120" y="155" fill="#71834d" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="4">${escapeXml(category.toUpperCase())}</text>
      <text x="120" y="285" fill="#25321f" font-family="Arial, sans-serif" font-size="58" font-weight="700">${escapeXml(title)}</text>
      <text x="120" y="365" fill="#71834d" font-family="Arial, sans-serif" font-size="24">${escapeXml(caption)}</text>
      <circle cx="752" cy="366" r="34" fill="#c7f36b"/>
      <path d="M738 366h28m-12-12 12 12-12 12" fill="none" stroke="#25321f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function attachImageFallbacks(copy) {
  const handleImageError = (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.fallback) return;

    image.dataset.fallback = "true";
    image.src = createImageFallback(
      image.alt || copy.title,
      image.dataset.fallbackCategory || copy.category,
      copy.caption
    );
  };

  window.addEventListener("error", handleImageError, true);
  return () => window.removeEventListener("error", handleImageError, true);
}
