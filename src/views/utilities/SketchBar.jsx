// project imports
import { useState, useEffect, useRef } from 'react';
import Breadcrumb from 'ui-component/cards/Breadcrumb';
import { useTables } from '../../hooks/useTables';
import { useDispatch } from 'react-redux';
import { createTable, updateTable, deleteTable } from '../../redux/utils/actions';
import toast from 'react-hot-toast';

// material-ui
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import tableBeerTwo from 'assets/images/icons/table-beer-2.png';
import tableBeerFour from 'assets/images/icons/table-beer-4.png';
import tableBeerSix from 'assets/images/icons/table-beer-6.png';
import lady from 'assets/images/icons/lady.png';
import gentleman from 'assets/images/icons/gentleman.png';
import barCounter from 'assets/images/icons/bar-counter.png';

// styles
const tableStyle = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'move',
  userSelect: 'none',
  zIndex: 1000
};

export default function SketchBar() {
  const dispatch = useDispatch();
  const { data: tables = [], isLoading} = useTables();
  const [open, setOpen] = useState(false);
  const [newTable, setNewTable] = useState({
    number: '',
    chairs: 4,
    positionX: 100,
    positionY: 100
  });
  const [draggedTable, setDraggedTable] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const barAreaRef = useRef(null);

  const [data, setData] = useState()

  useEffect(() => {
    setData(tables)
  }, [tables]);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNewTable({
      number: '',
      chairs: 4,
      positionX: 100,
      positionY: 100
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTable({
      ...newTable,
      [name]: name === 'chairs' ? parseInt(value, 10) : value
    });
  };

  const handleCreateTable = async () => {
    try {
      // Ensure we're sending the correct data format as specified in the API
      const tableData = {
        number: newTable.number,
        chairs: newTable.chairs,
        positionX: newTable.positionX,
        positionY: newTable.positionY
      };

      const res = await dispatch(createTable(tableData));

      if(res?.error) return toast.error(res?.error);

      setData(res)
      console.log('res handleCreateTable', res);
      toast.success('Mesa creada correctamente');
      handleCloseDialog();
    } catch (error) {
      console.error('Error al crear la mesa:', error);
      toast.error('Error al crear la mesa');
    }
  };

  const handleDeleteTable = async (id) => {
    try {
      // Set deleting flag to true and clear any dragged table
      setIsDeleting(true);
      setDraggedTable(null);

      const res = await dispatch(deleteTable(id));
      setData(res)
      toast.success('Mesa eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la mesa:', error);
      toast.error('Error al eliminar la mesa');
    } finally {
      // Reset deleting flag when operation completes (success or error)
      setIsDeleting(false);
    }
  };

  const handleMouseDown = (e, table) => {
    setDraggedTable(table);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    // Don't process mouse move if we're deleting a table or no table is being dragged
    if (isDeleting || !draggedTable) return;

    const barRect = barAreaRef.current.getBoundingClientRect();
    const tableSize = draggedTable.chairs * 15; // Approximate size based on chairs

    // Calculate new position within the bar area boundaries
    const newX = Math.max(
      tableSize / 2,
      Math.min(
        e.clientX - barRect.left - dragOffset.x,
        barRect.width - tableSize / 2
      )
    );

    const newY = Math.max(
      tableSize / 2,
      Math.min(
        e.clientY - barRect.top - dragOffset.y,
        barRect.height - tableSize / 2
      )
    );

    // Update the dragged table position in the UI
    setDraggedTable({
      ...draggedTable,
      positionX: newX,
      positionY: newY
    });
  };

  const handleMouseUp = async () => {
    // Don't process mouse up if we're deleting a table or no table is being dragged
    if (isDeleting || !draggedTable) return;

    try {
      // Update the table position in the database
      const res = await dispatch(updateTable(draggedTable.id, {
        positionX: draggedTable.positionX,
        positionY: draggedTable.positionY
      }));
      setData(res)
    } catch (error) {
      console.error('Error al actualizar la posición de la mesa:', error);
      toast.error('Error al actualizar la posición de la mesa');
    }

    setDraggedTable(null);
  };

  // Handle mouse leaving the bar area
  const handleMouseLeave = () => {
    // Don't process mouse leave if we're deleting a table
    if (!isDeleting && draggedTable) {
      handleMouseUp();
    }
  };

  console.log('tables', tables);

  const returnImg = {
    2: tableBeerTwo,
    4: tableBeerFour,
    6: tableBeerSix,
  }

  return (
    <>
      <Breadcrumb title="Sketch Bar" />

      <Paper
        sx={{
          p: 2,
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 200px)',
          position: 'relative'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h4">Diseño del Bar</Typography>
          <Fab
            color="primary"
            size="small"
            onClick={handleOpenDialog}
            aria-label="add"
          >
            <IconPlus />
          </Fab>
        </Box>

        <Box
          ref={barAreaRef}
          sx={{
            flex: 1,
            border: '1px dashed #ccc',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography>Cargando mesas...</Typography>
            </Box>
          ) : (
            data?.map((table) => {
              const isBeingDragged = draggedTable && draggedTable.id === table.id;
              const currentTable = isBeingDragged ? draggedTable : table;

              return (
                <Box
                  key={currentTable.id}
                  sx={{
                    ...tableStyle,
                    left: `${currentTable.positionX}px`,
                    top: `${currentTable.positionY}px`,
                    width: '150',
                    height: '150',
                  }}
                  onMouseDown={(e) => handleMouseDown(e, currentTable)}
                >
                  <img
                    src={returnImg[currentTable.chairs]}
                    alt="Tenampa"
                    width="150"
                    style={{ objectFit: 'contain', zIndex: 1 }}
                  />
                  <Typography variant="h6">#{currentTable.number}</Typography>
                  <Typography variant="caption">{currentTable.chairs} sillas</Typography>
                  <IconButton
                    size="small"
                    color="error"
                    sx={{ position: 'absolute', top: -10, right: -10, backgroundColor: 'white' }}
                    onClick={(e) => {
                      handleDeleteTable(currentTable.id);
                    }}
                  >
                    <IconTrash size={16} />
                  </IconButton>
                </Box>
              );
            })
          )}
          <img
            src={barCounter}
            alt="Tenampa"
            width="400"
            className='border'
            style={{
              position: 'absolute',
              bottom: 120,
              right: 10,
              margin: 'auto',
              transform: 'rotate(10deg)',
              transformOrigin: 'center'
            }}
          />
        </Box>
        <Box sx={{ position: 'absolute',bottom: 100 ,justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ border: '1px solid #ccc', height: 120, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={lady}
              alt="lady"
              width="30"
            />
          </Box>
          <Box sx={{ border: '1px solid #ccc', height: 120, width: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={gentleman}
              alt="gentleman"
              width="30"
            />
          </Box>
        </Box>
      </Paper>

      {/* Dialog for creating a new table */}
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Crear Nueva Mesa</DialogTitle>
        <DialogContent >
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Número de Mesa"
                name="number"
                value={newTable.number}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="chairs-label">Número de Sillas</InputLabel>
                <Select
                  labelId="chairs-label"
                  label="Número de Sillas"
                  name="chairs"
                  value={newTable.chairs}
                  onChange={handleInputChange}
                 variant='outlined'>
                  <MenuItem value={2}>2 Sillas</MenuItem>
                  <MenuItem value={4}>4 Sillas</MenuItem>
                  <MenuItem value={6}>6 Sillas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleCreateTable}
            variant="contained"
            color="primary"
            disabled={!newTable.number || !newTable.chairs}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
