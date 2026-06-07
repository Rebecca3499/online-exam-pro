export function formatSeconds(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds || 0))
  const h = Math.floor(safe / 3600)
  const m = Math.floor((safe % 3600) / 60)
  const s = safe % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

export function percent(value: number) {
  return `${Number(value || 0).toFixed(2)}%`
}

export function answerLabel(answer: string) {
  if (!answer) return '未作答'
  return answer
}
