import { describe, expect, it } from 'vitest'
import { validateDraft, validateNoOverlap } from './validation'
import type { Booking } from './types'

describe('booking validation', () => {
  it('requires start and end dates', () => {
    expect(validateDraft({ startDate: '', endDate: '' })).toBeTruthy()
    expect(validateDraft({ startDate: '2026-02-10', endDate: '' })).toBeTruthy()
    expect(validateDraft({ startDate: '', endDate: '2026-02-10' })).toBeTruthy()
  })

  it('rejects startDate after endDate', () => {
    expect(validateDraft({ startDate: '2026-02-11', endDate: '2026-02-10' })).toBeTruthy()
  })

  it('accepts equal start and end date', () => {
    expect(validateDraft({ startDate: '2026-02-10', endDate: '2026-02-10' })).toBeNull()
  })

  it('detects overlapping bookings (inclusive)', () => {
    const existing: Booking[] = [
      {
        id: 'a',
        startDate: '2026-02-10',
        endDate: '2026-02-12',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    // overlaps inside
    expect(
      validateNoOverlap({ startDate: '2026-02-11', endDate: '2026-02-11' }, existing),
    ).toBeTruthy()

    // overlaps touching boundary (inclusive)
    expect(
      validateNoOverlap({ startDate: '2026-02-12', endDate: '2026-02-14' }, existing),
    ).toBeTruthy()

    // does not overlap
    expect(
      validateNoOverlap({ startDate: '2026-02-13', endDate: '2026-02-14' }, existing),
    ).toBeNull()
  })

  it('ignores overlap against the same booking id when updating', () => {
    const existing: Booking[] = [
      {
        id: 'a',
        startDate: '2026-02-10',
        endDate: '2026-02-12',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    expect(
      validateNoOverlap(
        { startDate: '2026-02-10', endDate: '2026-02-12' },
        existing,
        'a',
      ),
    ).toBeNull()
  })
})
