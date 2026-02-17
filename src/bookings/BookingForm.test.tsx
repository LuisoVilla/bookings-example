import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { BookingForm } from './BookingForm'
import { renderWithMUI } from '../test/render'

describe('BookingForm', () => {
  it('submits create draft', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    renderWithMUI(
      <BookingForm
        mode="create"
        initialDraft={{ startDate: '', endDate: '' }}
        onSubmit={onSubmit}
      />,
    )

    await user.type(screen.getByLabelText(/start date/i), '2026-02-10')
    await user.type(screen.getByLabelText(/end date/i), '2026-02-11')
    await user.click(screen.getByRole('button', { name: /create booking/i }))

    expect(onSubmit).toHaveBeenCalledWith({ startDate: '2026-02-10', endDate: '2026-02-11' })
  })

  it('shows cancel button in edit mode', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    renderWithMUI(
      <BookingForm
        mode="edit"
        wrapInPaper={false}
        initialDraft={{ startDate: '2026-02-10', endDate: '2026-02-11' }}
        onSubmit={() => undefined}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalled()
  })
})
