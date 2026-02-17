import type { Booking, BookingDraft, BookingId } from './types'
import { toUtcTimestampAtMidnight } from './date'

function rangesOverlapInclusive(
  aStart: number,
  aEnd: number,
  bStart: number,
  bEnd: number,
): boolean {
  return aStart <= bEnd && aEnd >= bStart
}

export function validateDraft(draft: BookingDraft): string | null {
  if (!draft.startDate || !draft.endDate) return 'Start date and end date are required.'

  const start = toUtcTimestampAtMidnight(draft.startDate)
  const end = toUtcTimestampAtMidnight(draft.endDate)

  if (start == null || end == null) return 'Dates must be valid.'
  if (start > end) return 'Start date must be before (or equal to) end date.'

  return null
}

export function validateNoOverlap(
  draft: BookingDraft,
  existing: Booking[],
  ignoreId?: BookingId,
): string | null {
  const start = toUtcTimestampAtMidnight(draft.startDate)
  const end = toUtcTimestampAtMidnight(draft.endDate)
  if (start == null || end == null) return 'Dates must be valid.'

  const conflict = existing.find((b) => {
    if (ignoreId && b.id === ignoreId) return false

    const bStart = toUtcTimestampAtMidnight(b.startDate)
    const bEnd = toUtcTimestampAtMidnight(b.endDate)
    if (bStart == null || bEnd == null) return false

    return rangesOverlapInclusive(start, end, bStart, bEnd)
  })

  if (!conflict) return null
  return 'Booking overlaps an existing booking.'
}
