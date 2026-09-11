const CLOUDINARY_HOSTS = /res\.cloudinary\.com|c\.cdn-docs-ck\.com/

export function getOptimizedImage(
  url: string,
  { width = 1600 }: { width?: number } = {}
): string {
  if (!CLOUDINARY_HOSTS.test(url)) return url
  return url
    .replace(/\/w_\d+/, `/w_${width}`)
    .replace(/\/q_auto(?::[a-z_]+)?/, '/q_auto:good')
}