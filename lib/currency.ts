export function formatBs(value: number) {
  return `${Math.round(value).toLocaleString('es-VE')}Bs`
}

export function formatUsd(value: number) {
  return `${value.toFixed(0)}$`
}

export function usdToBs(usd: number, rate: number) {
  if (!rate || rate <= 0) return 0
  return usd * rate
}

export function bsToUsd(bs: number, rate: number) {
  if (!rate || rate <= 0) return 0
  return bs / rate
}

export function formatBsFromUsd(usd: number, rate: number) {
  return formatBs(usdToBs(usd, rate))
}

export function formatUsdFromBs(bs: number, rate: number) {
  return formatUsd(bsToUsd(bs, rate))
}
