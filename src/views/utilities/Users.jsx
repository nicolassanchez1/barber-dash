// project imports
import { useState } from 'react';
import Breadcrumb from 'ui-component/cards/Breadcrumb';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useUsers } from '../../hooks/useUsers';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import UserModal from './UserModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { getUserById, deleteUser, deleteMultipleUsers } from '../../redux/utils/actions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';


const INITIAL_DATA = {
  name: '',
  email: '',
  role: '',
  password: '',
  active: true
};

export default function Users() {

  const { data: users = [], isLoading, refetch: refetchUsers } = useUsers();
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = () => {
    setUser(INITIAL_DATA)
    setOpen(!open);
  };

  const handleDeleteModalToggle = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const { refetch } = useQuery({
    queryKey: ['user', selectedUsers],
    queryFn: async () => {
      const promises = selectedUsers.map((id) =>
        fetchUserDetails(id)
      );
      return await Promise.all(promises);
    },
    enabled: false,
  });

  const fetchUserDetails = async (id) => {
    try {
      const response = await dispatch(getUserById(id))
      setUser(response)
      return response
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  };

  const columns = [
    { field: 'username', headerName: 'Nombre', cellClassName: "wrapText", width: 200 },
    { field: 'email', headerName: 'Email', cellClassName: "wrapText", width: 250 },
    {
      field: 'rol',
      headerName: 'Rol',
      width: 150,
      renderCell: (params) => {
        return (
          <Card
            sx={{
              display: 'flex',
              gap: '5px',
              height: "100%",
              background: "transparent"
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  padding: "0 10px",
                  backgroundColor: params.value === 'admin' ? '#dcfbe4' : '#f8fafc',
                  color: params.value === 'admin' ? '#00c852' : 'inherit',
                  borderRadius: '4px'
                }}
                variant="subtitle1"
              >
                {params.value}
              </Typography>
            </Box>
          </Card>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 160,
      renderCell: (params) => {
        return (
          <Card
            sx={{
              display: 'flex',
              gap: '5px',
              height: "100%",
              background: "transparent"
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                height: "100%",
              }}
            >
              <Typography
                sx={{
                  padding: "0 10px",
                  color: params.value ? "#00c852" : "#f44336",
                  backgroundColor: params.value ? '#dcfbe4' : '#fce6e6',
                  borderRadius: '4px'
                }}
                variant="subtitle1"
              >
                {params.value ? "Activo" : "Inactivo"}
              </Typography>
            </Box>
          </Card>
        );
      }
    },
    { field: 'phone', headerName: 'Teléfono', cellClassName: "wrapText", width: 250 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const handleDeleteSelected = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let response;

      if (selectedUsers.length === 1) {
        // Delete a single user
        response = await dispatch(deleteUser(selectedUsers[0]));
      } else {
        // Delete multiple users
        response = await dispatch(deleteMultipleUsers(selectedUsers));
      }

      if (response?.error) {
        toast.error(response.error || 'Error al eliminar el usuario');
        return;
      }

      toast.success(
        selectedUsers.length === 1
          ? 'Usuario eliminado correctamente'
          : `${selectedUsers.length} usuarios eliminados correctamente`
      );
      await refetchUsers();
      setSelectedUsers([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar usuarios:', error);
      toast.error('Ocurrió un error al eliminar los usuarios');
    }
  };

  const handleEditSelected = async () => {
    await refetch();
    setOpen(true);
  };

  const filteredUsers = users?.length > 0 ? users?.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <>
      <UserModal open={open} handleToggle={handleToggle} user={user}/>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalToggle}
        onConfirm={handleConfirmDelete}
        selectedItems={selectedUsers}
        itemType="usuario"
      />
      <Breadcrumb title="Usuarios" />

      <div style={{ margin: '10px' }}></div>
      {
        isLoading ? <Skeleton variant="rounded" width={"100%"} height={"550px"} /> :
          <Paper
            sx={{
              height: "auto",
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >

          <div style={{ width: "100%" }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "10px 20px"}}>
                <TextField
                  label="Buscar usuario"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  margin="dense"
                />
              <div style={{  display: 'flex', alignItems: "center", gap: '12px' }}>

                {
                  selectedUsers.length === 1 && <>
                    <IconEdit
                      onClick={handleEditSelected}
                      stroke={2}
                      style={{
                        cursor: "pointer",
                        transition: "color 0.3s", // Animación del hover
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#1976d2")} // Color de hover (azul para editar)
                      onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")} // Revertir el color
                    />

                    <IconTrash
                      onClick={handleDeleteSelected}
                      stroke={2}
                      style={{
                        cursor: "pointer",
                        transition: "color 0.3s", // Animación del hover
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#e53935")} // Color de hover (rojo para eliminar)
                      onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")} // Revertir el color
                    />

                  </>
                }

                <Fab
                  component="div"
                  aria-label="add"
                  onClick={handleToggle}
                  variant="circular"
                  color="primary"
                  sx={{
                    width: 35,
                    height: 35,
                    zIndex: 1200,
                  }}
                >
                  <IconPlus />
                </Fab>

              </div>
            </div>

            <DataGrid
            rowHeight={80}
            rows={filteredUsers}
            columns={columns}
            initialState={{
              pagination: { paginationModel }
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={({ ids }) => {
              const idsArray = Array.from(ids || []);
              setSelectedUsers(idsArray);
            }}
            sx={{
              // Centrar texto en las celdas
              '& .MuiDataGrid-cell': {
                display: 'flex',
                justifyContent: 'center', // Centra horizontalmente
                alignItems: 'center', // Centra verticalmente
                textAlign: 'center' // Centra el texto si hay envoltura
              },

              // Opcional: Asegurar que el texto dentro de las celdas se ajuste automáticamente
              '& .wrapText': {
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                lineHeight: '1.5em'
              },
              border: 0,
            }}
            />
            </div>
          </Paper>
      }
    </>
  );
}
