import { SITE_URL } from '@/shared/lib/site'
import type { ProductWithBrand } from '@/features/catalog/actions/products'

export function ProductJsonLd({ product }: { product: ProductWithBrand }) {
  const price = product.precio_oferta ?? product.precio
  const imageUrl = product.imagenes?.[0]?.url ?? product.marca?.logo_url ?? '/logo.png'
  const availability =
    product.estado === 'agotado'
      ? 'https://schema.org/OutOfStock'
      : product.estado === 'pre_venta'
        ? 'https://schema.org/PreOrder'
        : 'https://schema.org/InStock'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.nombre,
    description: product.descripcion ?? `${product.nombre} de ${product.marca?.nombre ?? ''}`,
    image: imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`,
    url: `${SITE_URL}/producto/${product.slug}`,
    brand: product.marca
      ? {
          '@type': 'Brand',
          name: product.marca.nombre
        }
      : undefined,
    sku: product.codigo ?? undefined,
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'USD',
      availability,
      url: `${SITE_URL}/producto/${product.slug}`,
      itemCondition: 'https://schema.org/NewCondition'
    }
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EmiToys',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      'Coleccionables de autos a escala en Ecuador. Hot Wheels, Tarmac Works, Inno64, Mini GT y más.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'EC'
    },
    sameAs: []
  }

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
