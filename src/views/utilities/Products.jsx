// project imports
import { useState } from 'react';
import Breadcrumb from 'ui-component/cards/Breadcrumb';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import ProductModal from './ProductModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { getProductById, deleteProduct, deleteMultipleProducts } from '../../redux/utils/actions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';


const INITIAL_DATA = {
  productName:  '',
  productDescription: '',
  category: '',
  tags: [],
  price: '',
  discount: '',
  quantity: '',
  image: '',
  checked: true
};

export default function UIColor() {

  const { data: products = [], isLoading, refetch: refetchProduct } = useProducts();
  const { data: categories = []} = useCategories();
  const dispatch = useDispatch();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = () => {
    setProduct(INITIAL_DATA)
    setOpen(!open);
  };

  const handleDeleteModalToggle = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const { refetch } = useQuery({
    queryKey: ['product', selectedProducts],
    queryFn: async () => {
      const promises = selectedProducts.map((id) =>
        fetchProductDetails(id)
      );
      return await Promise.all(promises);
    },
    enabled: false,
  });

  const fetchProductDetails = async (id) => {
    try {
      const response = await dispatch(getProductById(id))
      setProduct(response)
      return response
    } catch (error) {
      console.error('Error al obtener producto:', error);
      return null;
    }
  };

  const columns = [
    {
      field: 'images',
      headerName: '#',
      width: 100,
      height: 300,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', height: "100%" }}>
          <img
            src={params.value}
            alt="Producto"
            style={{ maxWidth: '100%', maxHeight: '90px', objectFit: 'contain',alignSelf: 'center', borderRadius: '8px' }}
          />
        </div>

      )
    },
    { field: 'title', headerName: 'Titulo', cellClassName: "wrapText",   width: 200,},
    {
      field: 'category_id',
      headerName: 'Categoría',
      width: 150,
      cellClassName: "wrapText",
      valueGetter: (params) =>
        categories.find((cat) => cat.id === params)?.title || "Sin categoría"
    },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 150,
      renderCell: (params) => {
        const tagsArray = params.value?.split(',') || [];
        return (
          <Card
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              flexWrap: 'wrap',
              gap: '5px',
              background: "transparent",
            }}
          >
            {tagsArray.map((tag, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  alignSelf: 'center',
                  height: "100%",
                }}
              >

                <Typography sx={{ padding: "0 10px", backgroundColor: 'secondary.light',borderRadius: '4px'}} variant="subtitle1" color="secondary.dark">
                  {String(tag)}
                </Typography>
              </Box>
            ))}
          </Card>
        );
      }
    },
    {
      field: 'price',
      headerName: 'Precio',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 120,
    },

    {
      field: 'discount',
      headerName: 'Descuento',
      description: 'This column has a value getter y no es ordenable.',
      width: 130,
      valueGetter: (params) => {
        return typeof params === "string" ?  params?.replace(/%(\d+)/g, '$1%') : "0%"
      }
    },
    {
      field: 'in_stock',
      headerName: 'Stock',
      description: 'This column has a value getterƒ y no es ordenable.',
      width: 130,
      valueGetter: (params) => {
        return params
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      description: 'This column has a value getterƒ y no es ordenable.',
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
                <Typography sx={{ padding: "0 10px", color: params ? "#00c852" : "#f44336", backgroundColor: params ? '#dcfbe4' : '#fce6e6' ,borderRadius: '4px'}} variant="subtitle1" color="secondary.dark">
                  {params ? "In Stock" : "Out of Stock"}
                </Typography>
              </Box>
          </Card>
        );

      }
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const handleDeleteSelected = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      let response;

      if (selectedProducts.length === 1) {
        // Delete a single product
        response = await dispatch(deleteProduct(selectedProducts[0]));
      } else {
        // Delete multiple products
        response = await dispatch(deleteMultipleProducts(selectedProducts));
      }

      if (response?.error) {
        toast.error(response.error || 'Error al eliminar el producto');
        return;
      }

      toast.success(
        selectedProducts.length === 1
          ? 'Producto eliminado correctamente'
          : `${selectedProducts.length} productos eliminados correctamente`
      );
      await refetchProduct();
      setSelectedProducts([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      toast.error('Ocurrió un error al eliminar los productos');
    }
  };

  const handleEditSelected = async () => {
    await refetch();
    setOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log('selectedProducts', selectedProducts);

  return (
    <>
      <ProductModal open={open} handleToggle={handleToggle} categories={categories} product={product}/>
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalToggle}
        onConfirm={handleConfirmDelete}
        selectedItems={selectedProducts}
        itemType="producto"
      />
      <Breadcrumb title="Products" />

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
                  label="Buscar bebida"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  margin="dense"
                />
              <div style={{  display: 'flex', alignItems: "center", gap: '12px' }}>

                {
                  selectedProducts.length === 1 && <>
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
            rows={filteredProducts}
            columns={columns}
            initialState={{
              pagination: { paginationModel }
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={({ ids }) => {
              const idsArray = Array.from(ids || []);
              setSelectedProducts(idsArray);
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
