export const siteConfig = {
  name: 'PIROGRAFIA_CT',
  tagline: 'Pirograbado artístico · Retratos, logos, decoración',
  // Tasa de cambio usada solo para mostrar referencia en USD.
  // Ajusta este valor sin tocar el código (v1). En v2 lo movemos a Admin.
  usdRateBs: 357,
  contact: {
    whatsappNumber: '+584242167169',
    email: 'pirografia.ct@gmail.com'
  },
  socials: {
    instagram: 'https://www.instagram.com/pirografia_ct/',
    tiktok: 'https://www.tiktok.com/@pirografia_ct'
  },
  links: [
    { label: 'Catálogo', href: '/catalogo' },
    { label: 'Museo', href: '/museo' },
    { label: 'Cargue', href: '/cargue' },
    { label: 'Calculadora', href: '/calculadora' },
    { label: 'Links', href: '/links' }
  ]
} as const

export function whatsappHref(message?: string) {
  const base = `https://wa.me/${siteConfig.contact.whatsappNumber}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}
