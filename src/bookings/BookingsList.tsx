import {
  Checkbox,
  Divider,
  IconButton,
  Paper,
  Stack,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { formatIsoDate } from './date'
import type { Booking } from './types'

type Props = {
  bookings: Booking[]
  selectedId: string | null
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onDeleteSelected: () => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onCreateFirstBooking?: () => void
}

export function BookingsList({
  bookings,
  selectedId,
  selectedIds,
  onToggleSelect,
  onDeleteSelected,
  onEdit,
  onDelete,
  onCreateFirstBooking,
}: Props) {
  const selectedCount = selectedIds.length

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1}
        >
          <Typography variant="h6">Existing bookings</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {bookings.length} total{selectedCount ? ` • ${selectedCount} selected` : ''}
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="error"
              disabled={selectedCount === 0}
              onClick={onDeleteSelected}
            >
              Delete selected
            </Button>
          </Stack>
        </Stack>

        <Divider />

        {bookings.length === 0 ? (
          <Stack spacing={1} alignItems="flex-start">
            <Typography variant="body2" color="text.secondary">
              No bookings yet — create your first one above.
            </Typography>
            {onCreateFirstBooking ? (
              <Button size="small" variant="outlined" onClick={onCreateFirstBooking}>
                Create your first booking
              </Button>
            ) : null}
          </Stack>
        ) : (
          <TableContainer>
            <Table size="small" aria-label="bookings table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Select</TableCell>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => {
                  const primary = `${formatIsoDate(b.startDate)} → ${formatIsoDate(b.endDate)}`
                  const isSelected = b.id === selectedId
                  const secondary = isSelected ? 'Selected' : undefined
                  const isChecked = selectedIds.includes(b.id)

                  return (
                    <TableRow
                      key={b.id}
                      hover
                      sx={{ bgcolor: isSelected ? 'action.selected' : 'transparent' }}
                    >
                      <TableCell>
                        <Stack spacing={0.25}>
                          <Typography variant="body2">{primary}</Typography>
                          {secondary ? (
                            <Typography variant="caption" color="text.secondary">
                              {secondary}
                            </Typography>
                          ) : null}
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Checkbox
                          checked={isChecked}
                          onChange={() => onToggleSelect(b.id)}
                          inputProps={{ 'aria-label': `select booking ${b.id}` }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="edit" onClick={() => onEdit(b.id)}>
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          aria-label="delete"
                          color="error"
                          onClick={() => onDelete(b.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Paper>
  )
}
