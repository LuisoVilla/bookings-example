import { beforeEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, within } from '@testing-library/react'
import { BookingsPage } from './BookingsPage'
import { renderWithMUI } from '../test/render'
import { useBookingsStore } from './store'

vi.mock('react-toastify', async () => {
  const actual = await vi.importActual<typeof import('react-toastify')>('react-toastify')
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }
})

function seedBooking() {
  return useBookingsStore.getState().createBooking({
    startDate: '2026-02-10',
    endDate: '2026-02-11',
  })
}

describe('BookingsPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useBookingsStore.persist?.clearStorage?.()
    useBookingsStore.setState({ bookings: [], selectedId: null })
  })

  it('opens edit modal and updates booking', async () => {
    const created = seedBooking()
    if (!created.ok) throw new Error('expected seed ok')

    const user = userEvent.setup()
    renderWithMUI(<BookingsPage />)

    await user.click(screen.getByLabelText(/edit/i))

    const dialog = screen.getByRole('dialog')
    const endDate = within(dialog).getByLabelText(/end date/i)

    await user.clear(endDate)
    await user.type(endDate, '2026-02-12')
    await user.click(within(dialog).getByRole('button', { name: /update booking/i }))

    expect(useBookingsStore.getState().bookings[0]?.endDate).toBe('2026-02-12')
  })

  it('asks confirmation before deleting', async () => {
    const created = seedBooking()
    if (!created.ok) throw new Error('expected seed ok')

    const user = userEvent.setup()
    renderWithMUI(<BookingsPage />)

    await user.click(screen.getByLabelText(/delete/i))

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText(/delete booking\?/i)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: /delete/i }))

    expect(useBookingsStore.getState().bookings).toHaveLength(0)
  })

  it('deletes all selected bookings at once', async () => {
    const a = seedBooking()
    if (!a.ok) throw new Error('expected seed ok')
    const b = useBookingsStore.getState().createBooking({
      startDate: '2026-02-20',
      endDate: '2026-02-21',
    })
    if (!b.ok) throw new Error('expected seed ok')

    const user = userEvent.setup()
    renderWithMUI(<BookingsPage />)

    await user.click(screen.getByLabelText(new RegExp(`select booking ${a.bookingId}`, 'i')))
    await user.click(screen.getByLabelText(new RegExp(`select booking ${b.bookingId}`, 'i')))

    await user.click(screen.getByRole('button', { name: /delete selected/i }))

    const dialog = screen.getByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: /delete/i }))

    expect(useBookingsStore.getState().bookings).toHaveLength(0)
  })
})
