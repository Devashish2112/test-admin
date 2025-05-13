import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchVolunteers,
  updateVolunteerStatus,
  approveVolunteerStatus,
  rejectVolunteerStatus,
  setPage,
  setSearchQuery,
  setStatusFilter,
} from '../store/slices/volunteersSlice';

interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  skills: string[];
  availability: string;
  created_at: string;
  updated_at: string;
}

const Volunteers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { volunteers, total, loading, error, currentPage, searchQuery, statusFilter } = useAppSelector(
    (state) => state.volunteers
  );

  const [updateError, setUpdateError] = React.useState<string | null>(null);

  // Clear update error on status filter or page change
  React.useEffect(() => {
    setUpdateError(null);
  }, [statusFilter, currentPage]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedVolunteerDetails, setSelectedVolunteerDetails] = useState<Volunteer | null>(null);
  const rowsPerPage = 10;

  // Local state for search input to delay search until Enter pressed
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    const statusParam = statusFilter === 'all' ? undefined : statusFilter;
    // Remove search param to disable backend search
    dispatch(fetchVolunteers({ page: currentPage, status: statusParam }));
  }, [dispatch, currentPage, statusFilter]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    dispatch(setStatusFilter(event.target.value));
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      dispatch(setSearchQuery(searchInput));
      dispatch(setPage(1));
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, volunteer: Volunteer) => {
    setAnchorEl(event.currentTarget);
    setSelectedVolunteer(volunteer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVolunteer(null);
  };

  const handleStatusChange = async (volunteerId: string, status: string) => {
    console.log('handleStatusChange called with status:', status, 'volunteerId:', volunteerId);
    if (volunteerId) {
      let resultAction;
      try {
        if (status === 'approved') {
          resultAction = await dispatch(approveVolunteerStatus(volunteerId));
        } else if (status === 'rejected') {
          resultAction = await dispatch(rejectVolunteerStatus(volunteerId));
        } else {
          resultAction = await dispatch(updateVolunteerStatus({ volunteerId, status }));
        }
        console.log('Result action:', resultAction);
        if (updateVolunteerStatus.rejected.match(resultAction) || approveVolunteerStatus.rejected.match(resultAction) || rejectVolunteerStatus.rejected.match(resultAction)) {
          const errorPayload = resultAction.payload as any;
          let errorMessage = 'Failed to update volunteer status';
          if (errorPayload && typeof errorPayload === 'object' && 'detail' in errorPayload) {
            errorMessage = errorPayload.detail as string;
          } else if (typeof errorPayload === 'string') {
            errorMessage = errorPayload;
          }
          setUpdateError(errorMessage);
          console.error('Status update error:', errorMessage);
        } else {
          setUpdateError(null);
          handleMenuClose();
          // Refresh volunteers list after status update
          const statusParam = statusFilter === 'all' ? undefined : statusFilter;
          console.log('Dispatching fetchVolunteers with:', { page: currentPage, search: searchQuery, status: statusParam });
          await dispatch(fetchVolunteers({ page: currentPage, search: searchQuery, status: statusParam }));
          console.log('Status update successful');
        }
      } catch (error) {
        console.error('Exception in handleStatusChange:', error);
        setUpdateError('Unexpected error occurred');
      }
    }
  };

  const handleViewDetails = (volunteer: Volunteer) => {
    setSelectedVolunteerDetails(volunteer);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setViewDialogOpen(false);
    setSelectedVolunteerDetails(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Filter volunteers locally based on searchInput and statusFilter
  const filteredVolunteers = (volunteers || []).filter((volunteer) => {
    const matchesSearch =
      searchInput.trim() === '' ||
      volunteer.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchInput.toLowerCase()) ||
      volunteer.phone.toLowerCase().includes(searchInput.toLowerCase()) ||
      volunteer.skills.some((skill: string) => skill.toLowerCase().includes(searchInput.toLowerCase())) ||
      volunteer.availability.toLowerCase().includes(searchInput.toLowerCase()) ||
      volunteer.status.toLowerCase().includes(searchInput.toLowerCase());

    const matchesStatus = statusFilter === 'all' || volunteer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Volunteers
      </Typography>

      {updateError && (
        <Box mb={2}>
          <Typography color="error">{updateError}</Typography>
        </Box>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search volunteers..."
              value={searchInput}
              onChange={handleSearchChange}
              onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if (event.key === 'Enter') {
                  dispatch(setSearchQuery(searchInput));
                  dispatch(setPage(1));
                }
              }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={handleStatusFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer sx={{ overflowX: 'auto', maxHeight: 'none' }}>
            <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '15%' }}>Name</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '20%' }}>Email</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '15%' }}>Phone</TableCell>
                  <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word', width: '25%' }}>Skills</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '10%' }}>Availability</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '10%' }}>Status</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '5%' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVolunteers.map((volunteer: any) => (
                  <VolunteerRow
                    key={volunteer.id}
                    volunteer={volunteer}
                    handleStatusChange={handleStatusChange}
                    handleViewDetails={handleViewDetails}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

      <TablePagination
        component="div"
        count={filteredVolunteers.length}
        page={currentPage - 1}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedVolunteer && handleViewDetails(selectedVolunteer)}>
          View Details
        </MenuItem>
        <MenuItem onClick={() => selectedVolunteer && handleStatusChange(selectedVolunteer.id, 'approved')}>
          Approve
        </MenuItem>
        <MenuItem onClick={() => selectedVolunteer && handleStatusChange(selectedVolunteer.id, 'rejected')}>
          Reject
        </MenuItem>
      </Menu>

      <Dialog open={viewDialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Volunteer Details</DialogTitle>
        <DialogContent>
          {selectedVolunteerDetails && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                {selectedVolunteerDetails.name}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Email:</strong> {selectedVolunteerDetails.email}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Phone:</strong> {selectedVolunteerDetails.phone}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Skills:</strong>
              </Typography>
              <Box sx={{ mb: 2 }}>
                {selectedVolunteerDetails.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                <strong>Availability:</strong> {selectedVolunteerDetails.availability}
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Status:</strong>{' '}
                <Chip
                  label={selectedVolunteerDetails.status}
                  color={
                    selectedVolunteerDetails.status === 'approved'
                      ? 'success'
                      : selectedVolunteerDetails.status === 'rejected'
                      ? 'error'
                      : selectedVolunteerDetails.status === 'pending'
                      ? 'warning'
                      : 'default'
                  }
                  size="small"
                />
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Joined:</strong>{' '}
                {new Date(selectedVolunteerDetails.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface VolunteerRowProps {
  volunteer: any;
  handleStatusChange: (volunteerId: string, status: string) => void;
  handleViewDetails: (volunteer: any) => void;
}

const VolunteerRow: React.FC<VolunteerRowProps> = ({ volunteer, handleStatusChange, handleViewDetails }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableRow key={volunteer.id}>
      <TableCell>{volunteer.name}</TableCell>
      <TableCell>{volunteer.email}</TableCell>
      <TableCell>{volunteer.phone}</TableCell>
              <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: '100%' }}>
          {(volunteer.skills || []).map((skill: string, index: number) => (
            <Chip
              key={index}
              label={skill}
              size="small"
            />
          ))}
        </Box>
      </TableCell>
      <TableCell>{volunteer.availability}</TableCell>
      <TableCell>
        <Chip
          label={volunteer.status}
          color={
            volunteer.status === 'approved'
              ? 'success'
              : volunteer.status === 'rejected'
              ? 'error'
              : volunteer.status === 'pending'
              ? 'warning'
              : 'default'
          }
          size="small"
        />
      </TableCell>
      <TableCell>
        <IconButton
          size="small"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={() => handleViewDetails(volunteer)}>
            View Details
          </MenuItem>
          <MenuItem onClick={() => { handleStatusChange(volunteer.id, 'approved'); handleClose(); }}>
            Approve
          </MenuItem>
          <MenuItem onClick={() => { handleStatusChange(volunteer.id, 'rejected'); handleClose(); }}>
            Reject
          </MenuItem>
        </Menu>
      </TableCell>
    </TableRow>
  );
};

export default Volunteers;
