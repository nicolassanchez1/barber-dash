import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Fade, TextField, Button, FormControlLabel, Switch, Autocomplete, Chip } from '@mui/material';
import { IconCloudUp, IconX } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { createCategory, updateCategory, uploadImageCloudinary } from '../../redux/utils/actions';
import { useCategories } from '../../hooks/useCategories';
import toast from 'react-hot-toast';

const INITIAL_DATA = {
  categoryName: '',
  categoryDescription: '',
  tags: [],
  image: '',
  checked: true,
  isSection: true
};

export default function CategoryModal({ open, handleToggle, category = INITIAL_DATA }) {
  const { refetch } = useCategories();
  const dispatch = useDispatch();
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState('');

  const { categoryName, categoryDescription, checked, isSection, tags, image } = data;

  useEffect(() => {
    if (category?.id) {
      setData({
        categoryName: category?.categoryName || '',
        categoryDescription: category?.categoryDescription || '',
        tags: category?.tags ? category.tags.split(',').map(tag => tag.trim()) : [],
        image: category?.image || '',
        checked: category?.checked || true,
        isSection: category?.isSection || true
      });
    } else {
      setData(INITIAL_DATA);
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let resImage = category?.image || "";
    if (image && category?.image !== image) {
      const res = await dispatch(uploadImageCloudinary(image));

      if (res?.error) {
        setError(res?.error);
        toast.error(res?.error || 'Error al subir la imagen');
        return;
      }
      if (res === 'Hubo un error, intente mas tarde.') {
        setError(res);
        toast.error(res || 'Error al subir la imagen');
        return;
      }

      resImage = res;
    }

    const formatData = {
      title: categoryName,
      description: categoryDescription,
      is_section: isSection,
      status: checked,
      tags: Array.isArray(tags) ? tags.join(', ') : tags,
      image: resImage,
      slug: categoryName?.toLocaleLowerCase().split(' ').join('_')
    };

    const res = await dispatch(category?.id ? updateCategory(category?.id, formatData) : createCategory(formatData));
    if (res?.error) {
      setError(res?.error);
      toast.error(res?.error || 'Error al guardar la categoría');
      return;
    }

    toast.success(category?.id ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente');

    await refetch();

    handleToggle();
    setData(INITIAL_DATA);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setData({ ...data, image: URL.createObjectURL(file) });
    }
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
              {category?.id ? 'Editar' : 'Agregar'} Categoría
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="categoryName"
                label="Nombre de la Categoría"
                variant="outlined"
                fullWidth
                margin="normal"
                value={categoryName}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc', // Fondo personalizado
                  borderRadius: 1 // Bordes ligeramente redondeados
                }}
              />
              <TextField
                name="categoryDescription"
                label="Descripción"
                variant="outlined"
                fullWidth
                margin="normal"
                value={categoryDescription}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc', // Fondo personalizado
                  borderRadius: 1 // Bordes ligeramente redondeados
                }}
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(event, newValue) => {
                  setData({ ...data, tags: newValue });
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="tags"
                    label="Tags (presiona Enter para agregar)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    sx={{
                      bgcolor: '#f8fafc', // Fondo personalizado
                      borderRadius: 1 // Bordes ligeramente redondeados
                    }}
                  />
                )}
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 2
                }}
              >
                <FormControlLabel
                  label="Estado"
                  labelPlacement="top"
                  control={
                    <Switch name="checked" checked={checked} onChange={() => setData({ ...data, checked: !checked })} color="primary" />
                  }
                />
                <FormControlLabel
                  label="Mostrar"
                  labelPlacement="top"
                  control={
                    <Switch name="isSection" checked={isSection} onChange={() => setData({ ...data, isSection: !isSection })} color="primary" />
                  }
                />
              </Box>

              <Box
                sx={{
                  marginTop: 1
                }}
              >
                {!image ? (
                  <>
                    <input accept="image/*" id="upload-image" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                    <Typography variant="h5">Imagen de la categoría*</Typography>
                    <label htmlFor="upload-image" style={{ fontWeight: 500, cursor: 'pointer' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          height: 200,
                          border: '1px dashed #ccc',
                          borderRadius: 1,
                          cursor: 'pointer',
                          mt: 2,
                          mb: 2
                        }}
                      >
                        <IconCloudUp stroke={2} />
                        <Typography variant="h5">Drop file here to upload</Typography>
                      </Box>
                    </label>
                  </>
                ) : (
                  <Box sx={{ position: 'relative' }} mt={5}>
                    <IconX
                      style={{ cursor: 'pointer', position: 'absolute', right: 10, top: -30 }}
                      stroke={2}
                      onClick={() => setData({ ...data, image: '' })}
                    />
                    <img src={image} alt="Vista previa" style={{ width: '100%', maxWidth: 300 }} />
                  </Box>
                )}
              </Box>

              <Button
                disabled={!categoryName || !tags.length || !image}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {category?.id ? 'Editar' : 'Crear'} Categoría
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
