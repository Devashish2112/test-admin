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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
  Alert,
  IconButton,
  Menu,
  Tooltip,
  Paper,
} from '@mui/material';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import {
  fetchAlerts,
  createNewAlert,
  setPage,
  setSearchQuery,
  setSeverityFilter,
  updateAlertStatus,
  AlertCreate,
} from '../store/slices/alertsSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Alerts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, total, loading, error, currentPage, searchQuery, severityFilter } = useAppSelector(
    (state) => state.alerts
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const [newAlert, setNewAlert] = useState<AlertCreate>({
    title: '',
    description: '',
    severity: 'low',
    category: 'general',
    location: '',
    latitude: 0,
    longitude: 0,
    source: 'manual',
  });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewAlert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchAlerts({ page: currentPage, search: searchQuery, severity: severityFilter === 'all' ? '' : severityFilter }));
  }, [dispatch, currentPage, searchQuery, severityFilter]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(setPage(newPage + 1));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(event.target.value));
  };

  const handleSeverityFilterChange = (event: SelectChangeEvent) => {
    dispatch(setSeverityFilter(event.target.value));
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
    setSubmitError(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewAlert({
      title: '',
      description: '',
      severity: 'low',
      category: 'general',
      location: '',
      latitude: 0,
      longitude: 0,
      source: 'manual',
    });
    setSubmitError(null);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setNewAlert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAlert = async () => {
    if (!newAlert.title || !newAlert.description) {
      setSubmitError('Title and description are required');
      return;
    }

    try {
      console.log('Creating alert with data:', newAlert);
      await dispatch(createNewAlert(newAlert)).unwrap();
      handleDialogClose();
      // Refresh the alerts list after successful creation
      dispatch(fetchAlerts({ page: currentPage, search: searchQuery, severity: severityFilter === 'all' ? '' : severityFilter }));
    } catch (error) {
      console.error('Failed to create alert:', error);
      setSubmitError('Failed to create alert. Please try again.');
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, alertId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedAlertId(alertId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAlertId(null);
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedAlertId) return;
    
    try {
      await dispatch(updateAlertStatus({ alertId: Number(selectedAlertId), status })).unwrap();
      dispatch(fetchAlerts({ page: currentPage, search: searchQuery, severity: severityFilter === 'all' ? '' : severityFilter }));
    } catch (error) {
      console.error('Failed to update alert status:', error);
    }
    
    handleMenuClose();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Alerts Management
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleDialogOpen}
          sx={{ 
            borderRadius: 2, 
            px: 3, 
            boxShadow: 3,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 4,
            },
          }}
        >
          Create Alert
        </Button>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          mb: 3, 
          borderRadius: 3, 
          overflow: 'hidden',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <Box p={3}>
          <Box 
            display="flex" 
            gap={2} 
            mb={3}
            sx={{
              flexDirection: { xs: 'column', md: 'row' }
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={handleSearchChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <FormControl sx={{ minWidth: { xs: '100%', md: 200 } }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={handleSeverityFilterChange}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.default' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Severity</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(alerts) && alerts.length > 0 ? alerts.map((alert) => (
                  <TableRow 
                    key={alert._id}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                      '&:hover': { backgroundColor: 'action.selected' },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'medium' }}>{alert.title}</TableCell>
                    <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <Tooltip title={alert.description} arrow placement="top">
                        <Typography>{alert.description}</Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={alert.severity} 
                        color={
                          alert.severity === 'high' ? 'error' : 
                          alert.severity === 'medium' ? 'warning' : 
                          'success'
                        }
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          borderRadius: 1.5,
                          px: 1,
                        }}
                      />
                    </TableCell>
                    <TableCell>{alert.category}</TableCell>
                    <TableCell>{alert.created_by_name || 'System'}</TableCell>
                    <TableCell>{new Date(alert.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={(e) => handleMenuClick(e, alert._id)}
                        size="small"
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          } 
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="subtitle1" color="text.secondary" sx={{ py: 6 }}>
                        No alerts found
                      </Typography>
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
            sx={{ 
              '.MuiTablePagination-toolbar': {
                paddingLeft: 2,
              },
              '.MuiTablePagination-selectIcon': {
                color: 'primary.main',
              },
            }}
          />
        </Box>
      </Paper>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiList-root': {
            padding: 0.5,
            borderRadius: 2,
          },
          '& .MuiMenuItem-root': {
            padding: '8px 16px',
            borderRadius: 1,
            margin: '2px 0',
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
            },
          },
        }}
      >
        <MenuItem onClick={() => handleStatusChange('verified')} sx={{ gap: 1 }}>
          <CheckCircleIcon fontSize="small" /> Set Verified
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('resolved')} sx={{ gap: 1 }}>
          <DoneAllIcon fontSize="small" /> Set Resolved
        </MenuItem>
      </Menu>

      <Dialog 
        open={openDialog} 
        onClose={handleDialogClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          elevation: 5,
          sx: {
            borderRadius: 3,
            padding: 1,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid', borderColor: 'divider', pb: 1 }}>
          Create New Alert
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {submitError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{submitError}</Alert>}
          <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newAlert.title}
              onChange={handleTextInputChange}
              required
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newAlert.description}
              onChange={handleTextInputChange}
              required
              variant="outlined"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel id="severity-label">Severity</InputLabel>
              <Select
                labelId="severity-label"
                name="severity"
                value={newAlert.severity}
                label="Severity"
                onChange={handleSelectChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                name="category"
                value={newAlert.category}
                label="Category"
                onChange={handleSelectChange}
              >
                <MenuItem value="general">General</MenuItem>
                <MenuItem value="weather">Weather</MenuItem>
                <MenuItem value="earthquake">Earthquake</MenuItem>
                <MenuItem value="landslide">Landslide</MenuItem>
                <MenuItem value="flood">Flood</MenuItem>
                <MenuItem value="fire">Fire</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={newAlert.location}
              onChange={handleTextInputChange}
              placeholder="City, Region, etc."
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                type="number"
                value={newAlert.latitude}
                onChange={(e) => setNewAlert(prev => ({
                  ...prev,
                  latitude: parseFloat(e.target.value) || 0
                }))}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                type="number"
                value={newAlert.longitude}
                onChange={(e) => setNewAlert(prev => ({
                  ...prev,
                  longitude: parseFloat(e.target.value) || 0
                }))}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ padding: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Button 
            onClick={handleDialogClose}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateAlert} 
            variant="contained" 
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'medium',
              px: 3,
              '&:hover': {
                boxShadow: 3,
              },
            }}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alerts;
