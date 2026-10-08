/**
 * Formats image URLs for CDN image optimization & WebP format delivery.
 */
export const getOptimizedImageUrl = (url, options = {}) => {
  if (!url) return 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';

  const { width = 600, quality = 80, format = 'webp' } = options;

  // Handles Unsplash CDN parameters dynamically
  if (url.includes('images.unsplash.com')) {
    const urlObj = new URL(url);
    urlObj.searchParams.set('auto', 'format');
    urlObj.searchParams.set('fit', 'crop');
    urlObj.searchParams.set('w', width.toString());
    urlObj.searchParams.set('q', quality.toString());
    urlObj.searchParams.set('fm', format);
    return urlObj.toString();
  }

  // Cloudinary transform support (e.g. /upload/ -> /upload/f_auto,q_auto,w_600/)
  if (url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_${format},q_${quality},w_${width}/`);
  }

  return url;
};
