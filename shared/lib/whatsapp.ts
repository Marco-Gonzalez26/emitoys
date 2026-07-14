export function buildWhatsAppUrl(phoneNumber: string, productName: string, scale: string, price: number): string {
  const msg = encodeURIComponent(
    `Hola! Me interesa: ${productName} (${scale}) — $${price.toFixed(2)}. ¿Está disponible?`
  )
  return `https://wa.me/${phoneNumber}?text=${msg}`
}
