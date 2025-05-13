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
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchIncidents,
  updateIncidentStatus,
  verifyIncident,
  resolveIncident,
  setPage,
  setSearchQuery,
  setStatusFilter,
  setCategoryFilter,
} from '../store/slices/incidentsSlice';
import { SelectChangeEvent } from '@mui/material';

interface Incident {
  id: string;
  title: string;
  description: string;
  location: string;
  status: string;
  severity: string;
  reported_by: string;
  reporter_name: string | null;
  reporter_email?: string;
  verified_by_name?: string | null;
  created_at: string;
  updated_at: string;
  image_url?: string;
}

const Incidents: React.FC = () => {
  const dispatch = useAppDispatch();
  const { incidents, total, loading, error, currentPage, searchQuery, statusFilter, categoryFilter } = useAppSelector(
    (state) => state.incidents
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchIncidents({ page: currentPage, search: searchQuery, status: statusFilter, category: categoryFilter }));
  }, [dispatch, currentPage, searchQuery, statusFilter, categoryFilter]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      dispatch(setSearchQuery(localSearchQuery));
    }
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setStatusFilter(event.target.value));
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent<string>) => {
    dispatch(setCategoryFilter(event.target.value));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, incidentId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedIncident(incidentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIncident(null);
  };

  const handleStatusChange = async (status: string) => {
    console.log('handleStatusChange called with status:', status);
    if (selectedIncident) {
      try {
        if (status === 'verified') {
          console.log('Dispatching verifyIncident thunk');
          await dispatch(verifyIncident(selectedIncident));
        } else if (status === 'resolved') {
          console.log('Dispatching resolveIncident thunk');
          await dispatch(resolveIncident(selectedIncident));
        } else {
          console.log('Dispatching updateIncidentStatus thunk');
          await dispatch(updateIncidentStatus({ incidentId: selectedIncident, data: { status } }));
        }
      } catch (error) {
        console.error('Error updating incident status:', error);
      } finally {
        handleMenuClose();
      }
    }
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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Incidents
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search incidents..."
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearchKeyDown}
            />
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={handleStatusFilterChange}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="verified">Verified</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter || 'all'}
                label="Category"
                onChange={handleCategoryFilterChange}
              >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="Forest Fire">Forest Fire</MenuItem>
              <MenuItem value="Illegal Construction">Illegal Construction</MenuItem>
              <MenuItem value="Water Pollution">Water Pollution</MenuItem>
              <MenuItem value="Landslide">Landslide</MenuItem>
              <MenuItem value="Wildlife Crime">Wildlife Crime</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Photo</TableCell>
                  <TableCell>Location</TableCell>
                  {/* <TableCell>Severity</TableCell> */}
                  <TableCell>Status</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(incidents) ? incidents.map((incident: any) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      {incident.image_url ? (
                        <button
                          onClick={() => {
                            const baseUrl = "http://localhost:8000"; // Adjust backend base URL and port as needed
                            const link = document.createElement('a');
                            link.href = baseUrl + incident.image_url;
                            link.download = incident.image_url.split('/').pop() || 'image.jpg';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1976d2',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            padding: 0,
                            fontSize: '0.875rem',
                          }}
                        >
                          Download Image
                        </button>
                      ) : (
                        'No Image'
                      )}
                    </TableCell>
                    <TableCell>
                      {typeof incident.location === 'object' && incident.location !== null ? (
                        <button
                          style={{
                            padding: '2px 6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            const lat = (incident.location as {latitude: number, longitude: number}).latitude;
                            const lng = (incident.location as {latitude: number, longitude: number}).longitude;
                            const url = `https://www.google.com/maps?q=${lat},${lng}`;
                            window.open(url, '_blank');
                          }}
                        >
                          View on Google Maps
                        </button>
                      ) : (
                        incident.location
                      )}
                    </TableCell>
                    {/* <TableCell>
                      <Chip
                        label={incident.severity}
                        color={
                          incident.severity === 'high'
                            ? 'error'
                            : incident.severity === 'medium'
                            ? 'warning'
                            : 'success'
                        }
                        size="small"
                      />
                    </TableCell> */}
                    <TableCell>
                      <Chip
                        label={incident.status}
                        color={
                          incident.status === 'pending'
                            ? 'warning'
                            : incident.status === 'in_progress'
                            ? 'info'
                            : incident.status === 'resolved'
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{'reporter_name' in incident ? (incident.reporter_name as React.ReactNode) : (incident.reported_by as React.ReactNode)}</TableCell>
                    <TableCell>
                      {new Date(incident.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, incident.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    </TableCell>
                  </TableRow>
                )) : null}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={total}
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
        <MenuItem onClick={() => handleStatusChange('verified')}>
          Set Verified
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('resolved')}>
          Set Resolved
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Incidents;
