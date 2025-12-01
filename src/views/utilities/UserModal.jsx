import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Fade, TextField, Button, FormControlLabel, Switch } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createUser, updateUser } from '../../redux/utils/actions';
import { useUsers } from '../../hooks/useUsers';
import toast from 'react-hot-toast';

const INITIAL_DATA = {
  name: '',
  email: '',
  role: '',
  password: '',
  active: true,
  phone: ''
};

export default function UserModal({ open, handleToggle, user = INITIAL_DATA }) {
  const { refetch } = useUsers();

  const dispatch = useDispatch();
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState('');

  const { username,  email, role, password, active, phone} = data;

  useEffect(() => {
    if (user?.id) {
      setData({
        username: user?.username || '',
        email: user?.email || '',
        role: user?.rol === 'USER_ROLE' ? 'user' :
              user?.rol === 'ADMIN_ROLE' ? 'admin' :
              user?.rol === 'DELIVERY_ROLE' ? 'delivery' :
              user?.rol || user?.role || '',
        password: '',
        active: user?.status !== undefined ? user.status :
                user?.active !== undefined ? user.active : true,
        phone: user?.phone || ''
      });
    } else {
      setData(INITIAL_DATA);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formatData = {
      username,
      email,
      role,
      active,
      phone,
      ...(password && { password }) // Only include password if it's not empty
    };

    const res = await dispatch(user?.id ? updateUser(user?.id, formatData) : createUser(formatData));

    // Check if res is a string containing "User with"
    if (typeof res === 'string' && res.includes("User with")) {
      setError(res);
      toast.error( 'User with this email already exists');
      return;
    }

    if (res?.error) {
      setError(res?.error);
      toast.error(res?.error || 'Error al guardar el usuario');
      return;
    }

    toast.success(user?.id ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');

    await refetch();

    handleToggle();
    setData(INITIAL_DATA);
  };

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleToggle}
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
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: '26vw',
              bgcolor: 'background.paper',
              borderRight: '1px solid #ccc',
              boxShadow: 24,
              p: 3,
              overflowY: 'auto',
              outline: 'none'
            }}
          >
            <Typography variant="h5" component="h3" sx={{ mb: 1, fontSize: 20 }}>
              {user?.id ? 'Editar Usuario' : 'Agregar Usuario'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="username"
                label="Nombre"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 1
                }}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 1
                }}
              />

              <TextField
                name="phone"
                label="Teléfono"
                variant="outlined"
                fullWidth
                margin="normal"
                value={phone}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 1
                }}
              />

              <FormControl fullWidth margin="normal" sx={{ bgcolor: '#f8fafc', borderRadius: 1 }}>
                <InputLabel id="role-label">Rol</InputLabel>
                <Select
                  name="role"
                  labelId="role-label"
                  id="role-select"
                  value={role}
                  onChange={handleChange}
                  label="Rol"
                  variant="outlined"
                >
                  <MenuItem value="SUPER_ADMIN_ROLE">Admin</MenuItem>
                  <MenuItem value="USER_ROLE">Usuario</MenuItem>
                  <MenuItem value="DELIVERY_ROLE">Delivery</MenuItem>
                </Select>
              </FormControl>

              <TextField
                name="password"
                label={user?.id ? "Nueva Contraseña (dejar en blanco para mantener la actual)" : "Contraseña"}
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc',
                  borderRadius: 1
                }}
                required={!user?.id} // Only required for new users
              />

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  mt: 2
                }}
              >
                <FormControlLabel
                  label="Estado"
                  labelPlacement="start"
                  control={
                    <Switch name="active" checked={active} onChange={() => setData({ ...data, active: !active })} color="primary" />
                  }
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {user?.id ? 'Actualizar' : 'Crear'} Usuario
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
