import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface MapModalProps {
  open: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  title?: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  height: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
};

const MapModal: React.FC<MapModalProps> = ({ open, onClose, latitude, longitude, title }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="map-modal-title" aria-describedby="map-modal-description">
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography id="map-modal-title" variant="h6" component="h2">
            {title || 'Location'}
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Map functionality has been removed as per your request.
        </Typography>
      </Box>
    </Modal>
  );
};

export default MapModal;
