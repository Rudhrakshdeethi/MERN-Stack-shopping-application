const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0
});

export const formatPrice = (value) => currencyFormatter.format(Number(value || 0));

const escapeSvgText = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const createFallbackImage = (title = 'Product') => {
  const label = escapeSvgText(String(title || 'Product').trim().slice(0, 24) || 'Product');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 640 640">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" rx="48" fill="url(#bg)" />
      <circle cx="320" cy="220" r="88" fill="rgba(255,255,255,0.18)" />
      <rect x="140" y="360" width="360" height="26" rx="13" fill="rgba(255,255,255,0.92)" />
      <text
        x="320"
        y="465"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="34"
        font-weight="700"
        fill="#ffffff"
      >
        ${label}
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const getProductBySnapshot = (snapshot) => {
  if (!snapshot) {
    return null;
  }

  return {
    ...snapshot,
    id: snapshot.productId || snapshot.id || null,
    imageSrc: snapshot.imageSrc || createFallbackImage(snapshot.title),
    title: snapshot.title || 'Untitled Product'
  };
};
