import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Fade, TextField, Button, FormControlLabel, Switch } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { IconCloudUp, IconX } from '@tabler/icons-react';
import { useDispatch } from 'react-redux';
import { createProduct, updateProduct, uploadImageCloudinary } from '../../redux/utils/actions';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';

const INITIAL_DATA = {
  productName: '',
  productDescription: '',
  category: '',
  tags: [],
  price: '',
  discount: '',
  quantity: '',
  image: '',
  checked: true
};

export default function ProductModal({ open, handleToggle, categories, product = INITIAL_DATA }) {
  const { refetch } = useProducts();

  console.log('product INTOO', product);

  const dispatch = useDispatch();
  const [data, setData] = useState(INITIAL_DATA);
  const [error, setError] = useState('');

  const { productName, productDescription, checked, category, tags, price, discount, image, quantity } = data;

  useEffect(() => {
    if (product?.id) {
      setData({
        productName: product?.title || '',
        productDescription: product?.description || '',
        category: product?.category_id || '',
        tags: product?.tags ? product.tags.split(',') : [],
        price: product?.price || '',
        discount: product?.discount || '',
        quantity: product?.in_stock || '',
        image: product?.images || '',
        checked: product?.status || true
      });
    } else {
      setData(INITIAL_DATA);
    }
  }, [product]);

  const handlePriceChange = ({ target }) => {
    let value = target.value;
    value = value.replace(/[^0-9]/g, '');
    const formattedValue = new Intl.NumberFormat('en-US').format(value);
    setData({ ...data, price: formattedValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let resImage = product?.images || "";
    if (image && product?.images !== image) {
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
      price,
      description: productDescription,
      title: productName,
      status: checked,
      tags: tags?.join(',').toLowerCase(),
      category_id: category,
      discount: discount,
      slug: productName?.toLocaleLowerCase().split(' ').join('_'),
      images: resImage,
      in_stock: quantity
    };

    const res = await dispatch(product?.id ? updateProduct(product?.id, formatData) : createProduct(formatData));
    if (res?.error) {
      setError(res?.error);
      toast.error(res?.error || 'Error al guardar el producto');
      return;
    }

    toast.success(product?.id ? 'Producto actualizado correctamente' : 'Producto creado correctamente');

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
              Agregar Producto
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="productName"
                label="Nombre del Producto"
                variant="outlined"
                fullWidth
                margin="normal"
                value={productName}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc', // Fondo personalizado
                  borderRadius: 1 // Bordes ligeramente redondeados
                }}
              />
              <TextField
                name="productDescription"
                label="Descripción"
                variant="outlined"
                fullWidth
                margin="normal"
                value={productDescription}
                onChange={handleChange}
                sx={{
                  bgcolor: '#f8fafc', // Fondo personalizado
                  borderRadius: 1 // Bordes ligeramente redondeados
                }}
              />

              <FormControl fullWidth margin="normal" sx={{ bgcolor: '#f8fafc', borderRadius: 1 }}>
                <InputLabel id="categoria-label">Categoría</InputLabel>
                <Select
                  name="category"
                  labelId="categoria-label"
                  id="categoria-select"
                  value={category}
                  onChange={handleChange}
                  label="Categoría"
                  variant="outlined"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  marginBottom: 2
                }}
              >
                <TextField
                  name="price"
                  label="Precio"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={price}
                  onChange={handlePriceChange}
                  sx={{
                    bgcolor: '#f8fafc',
                    borderRadius: 1
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          marginRight: '-1px',
                          position: 'relative',
                          bottom: '0.3px'
                        }}
                      >
                        $
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  name="discount"
                  label="Descuento (%)"
                  variant="outlined"
                  type="number"
                  margin="normal"
                  fullWidth
                  value={discount}
                  onChange={handleChange}
                  sx={{
                    bgcolor: '#f8fafc',
                    borderRadius: 1
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          marginRight: '-1px',
                          position: 'relative',
                          bottom: '0.3px'
                        }}
                      >
                        %
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2
                }}
              >
                <TextField
                  name="quantity"
                  label="Cantidad"
                  variant="outlined"
                  type="number"
                  value={quantity}
                  onChange={handleChange}
                  sx={{
                    bgcolor: '#f8fafc',
                    borderRadius: 1
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{
                          marginRight: '-1px',
                          position: 'relative',
                          bottom: '0.3px'
                        }}
                      >
                        Ud
                      </InputAdornment>
                    )
                  }}
                />

                <Box
                  sx={{
                    width: '60%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <FormControlLabel
                    label="Estado"
                    labelPlacement="top"
                    control={
                      <Switch name="checked" checked={checked} onChange={() => setData({ ...data, checked: !checked })} color="primary" />
                    }
                  />
                </Box>
              </Box>

              <FormControl fullWidth margin="normal" sx={{ bgcolor: '#f8fafc', borderRadius: 1 }}>
                <InputLabel id="tags-label">Tags</InputLabel>
                <Select
                  name="tags"
                  labelId="tags-label"
                  id="tags-select"
                  multiple
                  value={tags}
                  onChange={handleChange}
                  label="Tags"
                  variant="outlined"
                  renderValue={(selected) => selected.join(', ')}
                >
                  {(categories.find((cat) => cat?.id === category)?.tags || '')
                    .split(',')
                    .filter((tag) => tag)
                    .map((tag, index) => (
                      <MenuItem key={index} value={tag}>
                        <Checkbox checked={tags?.includes(tag)} /> {/* Muestra un "check" en los items seleccionados */}
                        {tag}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <Box
                sx={{
                  marginTop: 1
                }}
              >
                {!image ? (
                  <>
                    <input accept="image/*" id="upload-image" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                    <Typography variant="h5">Imagen del producto*</Typography>
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
                disabled={!productName || !category || !price || !discount || !image || !quantity}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                {product?.id ? 'Editar' : 'Crear'} Producto
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
