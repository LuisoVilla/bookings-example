export function toUtcTimestampAtMidnight(isoDate: string): number | null {
  // Expects YYYY-MM-DD
  const parts = isoDate.split('-').map((p) => Number(p))
  if (parts.length !== 3) return null

  const [year, month, day] = parts
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return null
  }

  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return null

  return Date.UTC(year, month - 1, day)
}

export function formatIsoDate(isoDate: string): string {
  const ts = toUtcTimestampAtMidnight(isoDate)
  if (ts == null) return isoDate

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(ts))
}
