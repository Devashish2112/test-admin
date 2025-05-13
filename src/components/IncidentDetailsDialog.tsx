import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  Card,
  CardMedia,
} from '@mui/material';
import { 
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  CheckCircle as VerifiedIcon,
  Error as StatusIcon
} from '@mui/icons-material';

export interface IncidentDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  incident: any;
}

const IncidentDetailsDialog: React.FC<IncidentDetailsDialogProps> = ({ open, onClose, incident }) => {
  if (!incident) {
    return null;
  }

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{incident.title}</Typography>
          <Chip 
            label={incident.status} 
            color={getStatusColor(incident.status)}
            icon={<StatusIcon />}
          />
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {incident.image_url && (
            <Grid item xs={12}>
              <Card>
                <CardMedia
                  component="img"
                  height="300"
                  image={`http://localhost:8000${incident.image_url}`}
                  alt={incident.title}
                  sx={{ objectFit: 'contain' }}
                />
              </Card>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Description</Typography>
            <Typography variant="body1" paragraph>
              {incident.description}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Location</Typography>
            </Box>
            {typeof incident.location === 'object' && incident.location !== null ? (
              <Box>
                <Typography variant="body2">
                  Latitude: {incident.location.latitude}
                </Typography>
                <Typography variant="body2">
                  Longitude: {incident.location.longitude}
                </Typography>
                <Button 
                  size="small" 
                  variant="outlined" 
                  sx={{ mt: 1 }}
                  onClick={() => {
                    const url = `https://www.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}`;
                    window.open(url, '_blank');
                  }}
                >
                  View on Google Maps
                </Button>
              </Box>
            ) : (
              <Typography variant="body2">{incident.location || 'Not specified'}</Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Reported By</Typography>
            </Box>
            <Typography variant="body2">
              {incident.reporter_name || incident.reported_by || 'Anonymous'}
            </Typography>
            {incident.reporter_email && (
              <Typography variant="body2">
                Email: {incident.reporter_email}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Dates</Typography>
            </Box>
            <Typography variant="body2">
              Created: {formatDate(incident.created_at)}
            </Typography>
            <Typography variant="body2">
              Updated: {formatDate(incident.updated_at)}
            </Typography>
            {incident.resolved_at && (
              <Typography variant="body2">
                Resolved: {formatDate(incident.resolved_at)}
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            {incident.verified_by_name && (
              <>
                <Box display="flex" alignItems="center" mb={2}>
                  <VerifiedIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">Verification</Typography>
                </Box>
                <Typography variant="body2">
                  Verified by: {incident.verified_by_name}
                </Typography>
              </>
            )}
          </Grid>

          {incident.category && (
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" mb={1} mt={1}>
                <Typography variant="subtitle1" mr={1}>Category:</Typography>
                <Chip label={incident.category} color="primary" size="small" />
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncidentDetailsDialog; 