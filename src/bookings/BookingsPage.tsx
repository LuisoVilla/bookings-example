import { useMemo, useState } from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import { useBookingsStore } from './store'
import type { BookingDraft } from './types'
import { BookingForm } from './BookingForm'
import { BookingsList } from './BookingsList'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { BookingEditDialog } from './BookingEditDialog'

export function BookingsPage() {
  const bookings = useBookingsStore((s) => s.bookings)
  const selectedId = useBookingsStore((s) => s.selectedId)
  const selectBooking = useBookingsStore((s) => s.selectBooking)
  const createBooking = useBookingsStore((s) => s.createBooking)
  const updateBooking = useBookingsStore((s) => s.updateBooking)
  const deleteBooking = useBookingsStore((s) => s.deleteBooking)

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [bookings])

  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteCandidateIds, setDeleteCandidateIds] = useState<string[] | null>(null)
  const [editCandidateId, setEditCandidateId] = useState<string | null>(null)

  function handleCreate(draft: BookingDraft) {
    const result = createBooking(draft)
    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success('Booking created.')
  }

  function beginEdit(bookingId: string) {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    selectBooking(booking.id)
    setEditCandidateId(booking.id)
  }

  function closeEdit() {
    setEditCandidateId(null)
    selectBooking(null)
  }

  function handleEditSubmit(draft: BookingDraft) {
    if (!editCandidateId) return

    const result = updateBooking(editCandidateId, draft)
    if (!result.ok) {
      toast.error(result.error)
      return
    }

    toast.success('Booking updated.')
    closeEdit()
  }

  function requestDelete(id: string) {
    setDeleteCandidateIds([id])
  }

  function confirmDelete() {
    if (!deleteCandidateIds || deleteCandidateIds.length === 0) return

    deleteCandidateIds.forEach((id) => deleteBooking(id))
    setSelectedIds((prev) => prev.filter((id) => !deleteCandidateIds.includes(id)))
    setDeleteCandidateIds(null)

    toast.success(deleteCandidateIds.length === 1 ? 'Booking deleted.' : 'Bookings deleted.')
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function requestDeleteSelected() {
    if (selectedIds.length === 0) return
    setDeleteCandidateIds([...selectedIds])
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Bookings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, update, and delete bookings. Overlapping bookings are blocked.
          </Typography>
        </Box>

        <BookingForm
          mode="create"
          initialDraft={{ startDate: '', endDate: '' }}
          onSubmit={handleCreate}
        />

        <BookingsList
          bookings={sortedBookings}
          selectedId={selectedId}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onDeleteSelected={requestDeleteSelected}
          onEdit={beginEdit}
          onDelete={requestDelete}
        />

        <BookingEditDialog
          open={editCandidateId != null}
          booking={sortedBookings.find((b) => b.id === editCandidateId) ?? null}
          onSubmit={handleEditSubmit}
          onClose={closeEdit}
        />

        <ConfirmDialog
          open={deleteCandidateIds != null}
          title="Delete booking?"
          description={
            deleteCandidateIds && deleteCandidateIds.length > 1
              ? `This will delete ${deleteCandidateIds.length} bookings. This action cannot be undone.`
              : 'This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onClose={() => setDeleteCandidateIds(null)}
        />
      </Stack>
    </Container>
  )
}
