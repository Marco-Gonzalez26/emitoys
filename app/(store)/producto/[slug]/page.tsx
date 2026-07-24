import { notFound } from 'next/navigation'
import { getProductBySlug, getRelatedProducts } from '@/features/product/actions/product'
import { ProductDetail } from '@/features/product/components/ProductDetail'
import { ProductJsonLd } from '@/shared/components/JsonLd'
import { SITE_URL } from '@/shared/lib/site'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) return { title: 'Producto no encontrado' }

  const price = product.precio_oferta ?? product.precio
  const brand = product.marca?.nombre ?? ''
  const imageUrl = product.imagenes?.[0]?.url ?? product.marca?.logo_url ?? '/logo.png'
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_URL}${imageUrl}`

  return {
    title: `${product.nombre} — ${brand}`,
    description:
      product.descripcion?.slice(0, 160) ??
      `${product.nombre} de ${brand}. $${price.toFixed(2)} — Envíos a todo Ecuador.`,
    alternates: {
      canonical: `/producto/${slug}`
    },
    openGraph: {
      title: `${product.nombre} | EmiToys`,
      description:
        product.descripcion?.slice(0, 160) ??
        `${product.nombre} de ${brand}. $${price.toFixed(2)}`,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: product.nombre
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.nombre} | EmiToys`,
      description:
        product.descripcion?.slice(0, 160) ??
        `${product.nombre} de ${brand}. $${price.toFixed(2)}`,
      images: [absoluteImageUrl]
    }
  }
}

export default async function ProductPage({
  params
}: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = product.marca_id
    ? await getRelatedProducts(product.marca_id, product.id)
    : []

  return (
    <>
      <ProductJsonLd product={product} />
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
