import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { BookingsList } from './BookingsList'
import { renderWithMUI } from '../test/render'
import type { Booking } from './types'

describe('BookingsList', () => {
  it('renders bookings and triggers edit/delete callbacks', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const onToggleSelect = vi.fn()
    const onDeleteSelected = vi.fn()

    const bookings: Booking[] = [
      {
        id: 'a',
        startDate: '2026-02-10',
        endDate: '2026-02-11',
        createdAt: 0,
        updatedAt: 0,
      },
    ]

    renderWithMUI(
      <BookingsList
        bookings={bookings}
        selectedId={null}
        selectedIds={[]}
        onToggleSelect={onToggleSelect}
        onDeleteSelected={onDeleteSelected}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByLabelText(/select booking a/i))
    expect(onToggleSelect).toHaveBeenCalledWith('a')

    await user.click(screen.getByLabelText(/edit/i))
    expect(onEdit).toHaveBeenCalledWith('a')

    const deleteBtn = screen.getByLabelText(/delete/i)
    expect(deleteBtn.className).toMatch(/colorError/i)

    await user.click(deleteBtn)
    expect(onDelete).toHaveBeenCalledWith('a')
  })
})
