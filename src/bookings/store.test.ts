import { beforeEach, describe, expect, it } from 'vitest'
import { useBookingsStore } from './store'

function resetStore() {
  useBookingsStore.setState({ bookings: [], selectedId: null })
}

describe('bookings store', () => {
  beforeEach(() => {
    localStorage.clear()
    // zustand persist attaches helpers at runtime
    useBookingsStore.persist?.clearStorage?.()
    resetStore()
  })

  it('creates a booking', () => {
    const res = useBookingsStore.getState().createBooking({
      startDate: '2026-02-10',
      endDate: '2026-02-11',
    })

    expect(res.ok).toBe(true)
    expect(useBookingsStore.getState().bookings).toHaveLength(1)
  })

  it('prevents overlapping bookings', () => {
    const s = useBookingsStore.getState()
    expect(
      s.createBooking({ startDate: '2026-02-10', endDate: '2026-02-12' }).ok,
    ).toBe(true)

    const res2 = s.createBooking({ startDate: '2026-02-12', endDate: '2026-02-13' })
    expect(res2.ok).toBe(false)
  })

  it('updates a booking', () => {
    const s = useBookingsStore.getState()
    const created = s.createBooking({ startDate: '2026-02-10', endDate: '2026-02-11' })
    if (!created.ok) throw new Error('expected create ok')

    const upd = s.updateBooking(created.bookingId, {
      startDate: '2026-02-15',
      endDate: '2026-02-16',
    })

    expect(upd.ok).toBe(true)
    expect(useBookingsStore.getState().bookings[0]?.startDate).toBe('2026-02-15')
  })

  it('deletes a booking', () => {
    const s = useBookingsStore.getState()
    const created = s.createBooking({ startDate: '2026-02-10', endDate: '2026-02-11' })
    if (!created.ok) throw new Error('expected create ok')

    s.deleteBooking(created.bookingId)
    expect(useBookingsStore.getState().bookings).toHaveLength(0)
  })
})
