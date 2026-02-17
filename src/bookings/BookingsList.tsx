import {
  Checkbox,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Paper,
  Stack,
  Button,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { TransitionGroup } from 'react-transition-group'
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
}

export function BookingsList({
  bookings,
  selectedId,
  selectedIds,
  onToggleSelect,
  onDeleteSelected,
  onEdit,
  onDelete,
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
          <Typography variant="body2" color="text.secondary">
            No bookings yet.
          </Typography>
        ) : (
          <List disablePadding>
            <TransitionGroup component={null}>
              {bookings.map((b) => {
                const primary = `${formatIsoDate(b.startDate)} → ${formatIsoDate(b.endDate)}`
                const isSelected = b.id === selectedId
                const secondary = isSelected ? 'Selected' : undefined
                const isChecked = selectedIds.includes(b.id)

                return (
                  <Collapse key={b.id} timeout={200}>
                    <ListItem
                      divider
                      sx={(theme) => ({
                        alignItems: 'flex-start',
                        transition: theme.transitions.create(['background-color'], {
                          duration: theme.transitions.duration.shortest,
                        }),
                        bgcolor: isSelected ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: isSelected ? 'action.selected' : 'action.hover' },
                        '&:last-of-type': { borderBottom: 'none' },
                      })}
                    >
                      <ListItemText primary={primary} secondary={secondary} />
                      <ListItemSecondaryAction>
                        <Checkbox
                          checked={isChecked}
                          onChange={() => onToggleSelect(b.id)}
                          inputProps={{ 'aria-label': `select booking ${b.id}` }}
                        />
                        <IconButton edge="end" aria-label="edit" onClick={() => onEdit(b.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          color="error"
                          onClick={() => onDelete(b.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Collapse>
                )
              })}
            </TransitionGroup>
          </List>
        )}
      </Stack>
    </Paper>
  )
}
