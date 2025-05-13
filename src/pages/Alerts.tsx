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
} from '../store/slices/alertsSlice';

const Alerts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, total, loading, error, currentPage, searchQuery, severityFilter } = useAppSelector(
    (state) => state.alerts
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [newAlert, setNewAlert] = useState<{
    title: string;
    description: string;
    category: string;
    location: {
      latitude: number;
      longitude: number;
    };
    image_url: string | null;
    status: string;
    reporter_name: string;
    reporter_email: string;
  }>({
    title: '',
    description: '',
    category: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    image_url: null,
    status: 'pending',
    reporter_name: '',
    reporter_email: '',
  });

  const handleTextInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'latitude' || name === 'longitude') {
      setNewAlert((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: parseFloat(value),
        },
      }));
    } else {
      setNewAlert((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewAlert({
      title: '',
      description: '',
      category: '',
      location: {
        latitude: 0,
        longitude: 0,
      },
      image_url: null,
      status: 'pending',
      reporter_name: '',
      reporter_email: '',
    });
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setNewAlert((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAlert = async () => {
    const alertToCreate = {
      title: newAlert.title,
      description: newAlert.description,
      category: newAlert.category,
      location: newAlert.location,
      image_url: newAlert.image_url,
      status: newAlert.status,
      reporter_name: newAlert.reporter_name,
      reporter_email: newAlert.reporter_email,
    };
    console.log('Creating alert with data:', alertToCreate);
    await dispatch(createNewAlert(alertToCreate));
    handleDialogClose();
  };

  const handleStatusChange = (alertId: number, status: string) => {
    dispatch(updateAlertStatus({ alertId, status }));
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
        <Typography variant="h4">Alerts</Typography>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          Create Alert
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Severity</InputLabel>
              <Select
                value={severityFilter}
                label="Severity"
                onChange={handleSeverityFilterChange}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="low">Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(alerts) ? alerts.map((alert) => (
                  <TableRow key={alert._id}>
                    <TableCell>{alert.title}</TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell>{alert.category}</TableCell>
                    <TableCell>
                      {new Date(alert.created_at).toLocaleDateString()}
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

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Create New Alert</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newAlert.title}
              onChange={handleTextInputChange}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={newAlert.description}
              onChange={handleTextInputChange}
            />
            <TextField
              fullWidth
              label="Category"
              name="category"
              value={newAlert.category}
              onChange={handleTextInputChange}
            />
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              type="number"
              value={newAlert.location.latitude}
              onChange={(e) =>
                setNewAlert((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    latitude: parseFloat(e.target.value),
                  },
                }))
              }
            />
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              type="number"
              value={newAlert.location.longitude}
              onChange={(e) =>
                setNewAlert((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    longitude: parseFloat(e.target.value),
                  },
                }))
              }
            />
            <TextField
              fullWidth
              label="Image URL"
              name="image_url"
              value={newAlert.image_url || ''}
              onChange={handleTextInputChange}
            />
            <TextField
              fullWidth
              label="Reporter Name"
              name="reporter_name"
              value={newAlert.reporter_name}
              onChange={handleTextInputChange}
            />
            <TextField
              fullWidth
              label="Reporter Email"
              name="reporter_email"
              value={newAlert.reporter_email}
              onChange={handleTextInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateAlert} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Alerts;
