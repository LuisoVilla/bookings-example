import { Dialog, DialogContent, Grow } from '@mui/material'
import type { Booking, BookingDraft } from './types'
import { BookingForm } from './BookingForm'

type Props = {
  open: boolean
  booking: Booking | null
  onSubmit: (draft: BookingDraft) => void
  onClose: () => void
}

export function BookingEditDialog({ open, booking, onSubmit, onClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Grow}
      transitionDuration={180}
    >
      <DialogContent>
        {booking ? (
          <BookingForm
            key={booking.id}
            mode="edit"
            wrapInPaper={false}
            initialDraft={{ startDate: booking.startDate, endDate: booking.endDate }}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
