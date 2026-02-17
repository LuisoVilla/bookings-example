import { describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/react'
import { ConfirmDialog } from './ConfirmDialog'
import { renderWithMUI } from '../test/render'

describe('ConfirmDialog', () => {
  it('calls onConfirm and onClose', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()
    const onClose = vi.fn()

    renderWithMUI(
      <ConfirmDialog
        open
        title="Delete booking?"
        description="This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={onConfirm}
        onClose={onClose}
      />,
    )

    expect(screen.getByText('Delete booking?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
