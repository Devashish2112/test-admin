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
  Button,
  Snackbar,
  Alert,
  Tooltip,
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
import { useNavigate } from 'react-router-dom';
import IncidentDetailsDialog from '../components/IncidentDetailsDialog';
import { getIncidentById } from '../services/api';

interface Incident {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  location: string | { latitude: number; longitude: number };
  status: string;
  severity: string;
  reported_by: string;
  reporter_name: string | null;
  reporter_email?: string;
  verified_by_name?: string | null;
  created_at: string;
  updated_at: string;
  image_url?: string;
  category?: string;
  resolved_at?: string;
}

const Incidents: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { incidents, total, loading, error, currentPage, searchQuery, statusFilter, categoryFilter } = useAppSelector(
    (state) => state.incidents
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);
  const [selectedIncidentData, setSelectedIncidentData] = useState<Incident | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [incidentDetails, setIncidentDetails] = useState<Incident | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const rowsPerPage = 10;

  useEffect(() => {
    console.log('Fetching incidents with parameters:', {
      page: currentPage, 
      search: searchQuery, 
      status: statusFilter, 
      category: categoryFilter
    });
    dispatch(fetchIncidents({ page: currentPage, search: searchQuery, status: statusFilter, category: categoryFilter }));
  }, [dispatch, currentPage, searchQuery, statusFilter, categoryFilter]);

  useEffect(() => {
    console.log('Current incidents data:', incidents);
    // Debug any ID conversion issues
    if (Array.isArray(incidents) && incidents.length > 0) {
      incidents.forEach(incident => {
        console.log(`Incident ID check - id: ${incident.id}, _id: ${(incident as any)._id}`);
      });
    }
  }, [incidents]);

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, incident: Incident) => {
    event.stopPropagation();
    
    // Extract the correct ID form - either id or _id
    const incidentId = incident.id || incident._id;
    
    if (!incidentId) {
      console.error('No ID found for incident:', incident);
      return;
    }
    
    console.log('Opening menu for incident:', incident, 'with ID:', incidentId);
    setAnchorEl(event.currentTarget);
    setSelectedIncident(incidentId);
    setSelectedIncidentData(incident);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedIncident(null);
    setSelectedIncidentData(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showNotification = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleStatusChange = async (status: string) => {
    console.log('Handle status change called with status:', status, 'for incident:', selectedIncident);
    
    if (selectedIncident) {
      try {
        if (status === 'verified') {
          console.log('Dispatching verifyIncident action with ID:', selectedIncident);
          await dispatch(verifyIncident(selectedIncident)).unwrap();
          showNotification('Incident marked as verified successfully', 'success');
        } else if (status === 'resolved') {
          console.log('Dispatching resolveIncident action with ID:', selectedIncident);
          await dispatch(resolveIncident(selectedIncident)).unwrap();
          showNotification('Incident marked as resolved successfully', 'success');
        } else {
          console.log('Dispatching updateIncidentStatus action with ID:', selectedIncident);
          await dispatch(updateIncidentStatus({ 
            incidentId: selectedIncident, 
            data: { status } 
          })).unwrap();
          showNotification(`Incident status updated to ${status}`, 'success');
        }
        
        // Refresh the incidents list
        dispatch(fetchIncidents({ 
          page: currentPage, 
          search: searchQuery, 
          status: statusFilter, 
          category: categoryFilter 
        }));
      } catch (error) {
        console.error('Error updating incident status:', error);
        showNotification('Failed to update incident status. Please try again.', 'error');
      } finally {
        handleMenuClose();
      }
    } else {
      console.error('No incident selected for status change');
      showNotification('No incident selected', 'error');
    }
  };

  const fetchIncidentDetails = async (incidentId: string) => {
    setDetailsLoading(true);
    try {
      console.log('Fetching incident details for ID:', incidentId);
      const response = await getIncidentById(incidentId);
      console.log('Incident details response:', response.data);
      setIncidentDetails(response.data);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching incident details:', error);
      showNotification('Failed to load incident details', 'error');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (selectedIncident) {
      fetchIncidentDetails(selectedIncident);
      handleMenuClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'verified':
        return 'info';
      case 'resolved':
        return 'success';
      default:
        return 'default';
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
                <MenuItem value="pending">Pending</MenuItem>
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
                  <TableCell>Status</TableCell>
                  <TableCell>Reported By</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(incidents) && incidents.length > 0 ? incidents.map((incident: any) => {
                  // Ensure incident has an id field
                  const incidentWithId = {
                    ...incident,
                    id: incident.id || incident._id
                  };
                  
                  return (
                    <TableRow key={incidentWithId.id}>
                      <TableCell>{incidentWithId.title}</TableCell>
                      <TableCell>
                        {incidentWithId.image_url ? (
                          <button
                            onClick={() => {
                              const baseUrl = "http://localhost:8000"; // Adjust backend base URL and port as needed
                              const link = document.createElement('a');
                              link.href = baseUrl + incidentWithId.image_url;
                              link.download = incidentWithId.image_url.split('/').pop() || 'image.jpg';
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
                        {typeof incidentWithId.location === 'object' && incidentWithId.location !== null ? (
                          <button
                            style={{
                              padding: '2px 6px',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const lat = (incidentWithId.location as {latitude: number, longitude: number}).latitude;
                              const lng = (incidentWithId.location as {latitude: number, longitude: number}).longitude;
                              const url = `https://www.google.com/maps?q=${lat},${lng}`;
                              window.open(url, '_blank');
                            }}
                          >
                            View on Google Maps
                          </button>
                        ) : (
                          incidentWithId.location
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={incidentWithId.status}
                          color={getStatusColor(incidentWithId.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{'reporter_name' in incidentWithId ? (incidentWithId.reporter_name as React.ReactNode) : (incidentWithId.reported_by as React.ReactNode)}</TableCell>
                      <TableCell>
                        {new Date(incidentWithId.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Manage Incident">
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, incidentWithId)}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No incidents found
                    </TableCell>
                  </TableRow>
                )}
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
        <MenuItem onClick={handleViewDetails}>
          View Details
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange('verified')}
          disabled={selectedIncidentData?.status === 'verified' || 
                   selectedIncidentData?.status === 'resolved'}
        >
          Mark as Verified
        </MenuItem>
        <MenuItem 
          onClick={() => handleStatusChange('resolved')}
          disabled={selectedIncidentData?.status === 'resolved'}
        >
          Mark as Resolved
        </MenuItem>
      </Menu>

      {/* Incident Details Dialog */}
      <IncidentDetailsDialog 
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        incident={incidentDetails}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Loading Overlay for Details */}
      {detailsLoading && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="rgba(0, 0, 0, 0.5)"
          zIndex={9999}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default Incidents;
