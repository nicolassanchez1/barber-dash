import React from 'react';
import { Modal, Box, Typography, Fade, Button } from '@mui/material';
import { IconAlertTriangle } from '@tabler/icons-react';

export default function DeleteConfirmationModal({ open, handleClose, onConfirm, selectedItems, itemType = "producto" }) {
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slotProps={{
          backdrop: {
            timeout: 500
          }
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              outline: 'none'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <IconAlertTriangle color="#f44336" size={28} stroke={2} style={{ marginRight: '10px' }} />
              <Typography variant="h5" component="h2">
                Confirmar eliminación
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {selectedItems.length === 1
                ? `¿Estás seguro de que deseas eliminar la ${itemType} seleccionada?`
                : `¿Estás seguro de que deseas eliminar las ${selectedItems.length} ${itemType}s seleccionadas?`}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button onClick={handleClose} variant="outlined">
                Cancelar
              </Button>
              <Button onClick={onConfirm} variant="contained" color="error">
                Eliminar
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
