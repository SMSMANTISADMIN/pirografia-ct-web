# Pirografía-CT Portal (v1)

Portal basado en la maqueta: **Calculadora · Museo · Cargue · Redes/Links · WhatsApp/Correo**.

## Requisitos
- Node 18+ (recomendado 20)

## Arranque
```bash
npm i
npm run dev
```

## Configuración rápida
Edita:
- `lib/site-config.ts` (WhatsApp, correo, redes, links)
- `data/museo.json` (piezas)
- `public/images/museo/*` (imágenes)

### Tasa BCV (AUTO con 3 fuentes + redundancia)
El catálogo está **en USD como base** y se convierte a Bs con la tasa.

Variables recomendadas (ejemplo):
```bash
# Protege los endpoints /api/rate/* (opcional pero recomendado)
ADMIN_API_TOKEN="tu-token"

# 3 proveedores (A/B/C). Debes indicar URL + ruta JSON donde está la tasa.
RATE_A_NAME="BCV Provider 1"
RATE_A_URL="https://..."
RATE_A_PATH="data.bcv.usd"

RATE_B_NAME="BCV Provider 2"
RATE_B_URL="https://..."
RATE_B_PATH="usd"

RATE_C_NAME="BCV Provider 3"
RATE_C_URL="https://..."
RATE_C_PATH="rates.USD"

# Tolerancias
RATE_DELTA_PCT=0.005   # 0.5% (para considerar que coinciden)
RATE_MAX_JUMP_PCT=0.05 # 5% (anti-salto vs última tasa válida)

# Persistencia (por defecto 'file' escribe en ./var/rate-state.json)
RATE_STORAGE=file
```

Panel admin local: `http://localhost:3000/admin`

> Nota: en entornos serverless, escritura a disco puede no persistir. En VPS/Docker funciona perfecto.

## Roadmap v2 (siguiente nivel)
- Cargue real con Cloudinary + Supabase (auth + estados)
- Panel admin (crear/editar piezas, tags, precios)
- SEO/OG por pieza
- i18n ES/EN si el cliente lo requiere
