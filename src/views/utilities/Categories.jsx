// project imports
import { useEffect, useState } from 'react';
import Breadcrumb from 'ui-component/cards/Breadcrumb';

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useCategories } from '../../hooks/useCategories';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { IconTrash, IconEdit, IconPlus } from '@tabler/icons-react';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import CategoryModal from './CategoryModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useQuery } from '@tanstack/react-query';
import { deleteCategory, deleteMultipleCategories } from '../../redux/utils/actions';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';


const INITIAL_DATA = {
  categoryName: '',
  categoryDescription: '',
  tags: '',
  image: '',
  checked: true
};

export default function Categories() {
  const { data: categories = [], isLoading, refetch: refetchCategory } = useCategories();
  const dispatch = useDispatch();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [category, setCategory] = useState({});
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggle = () => {
    setCategory(INITIAL_DATA)
    setOpen(!open);
  };

  const handleDeleteModalToggle = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };

  const { refetch } = useQuery({
    queryKey: ['category', selectedCategories],
    queryFn: async () => {
      const promises = selectedCategories.map((id) =>
        fetchCategoryDetails(id)
      );
      return await Promise.all(promises);
    },
    enabled: false,
  });

  const fetchCategoryDetails = async (id) => {
    try {
      // Find the category in the existing data
      const foundCategory = categories.find(cat => cat.id === id);
      if (foundCategory) {
        setCategory({
          categoryName: foundCategory.title || '',
          categoryDescription: foundCategory.description || '',
          tags: foundCategory.tags || '',
          image: foundCategory.image || '',
          checked: foundCategory.status || true,
          id: foundCategory.id
        });
        return foundCategory;
      }
      return null;
    } catch (error) {
      console.error('Error al obtener categoría:', error);
      return null;
    }
  };

  const columns = [
    {
      field: 'image',
      headerName: '#',
      width: 100,
      height: 300,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', height: "100%" }}>
          <img
            src={params.value}
            alt="Categoría"
            style={{ maxWidth: '100%', maxHeight: '90px', objectFit: 'contain', alignSelf: 'center', borderRadius: '8px' }}
          />
        </div>
      )
    },
    { field: 'title', headerName: 'Título', cellClassName: "wrapText", width: 200 },
    {
      field: 'tags',
      headerName: 'Tags',
      width: 250,
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
                <Typography sx={{ padding: "0 10px", backgroundColor: 'secondary.light', borderRadius: '4px' }} variant="subtitle1" color="secondary.dark">
                  {String(tag)}
                </Typography>
              </Box>
            ))}
          </Card>
        );
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
              <Typography sx={{ padding: "0 10px", color: params ? "#00c852" : "#f44336", backgroundColor: params ? '#dcfbe4' : '#fce6e6', borderRadius: '4px' }} variant="subtitle1" color="secondary.dark">
                {params ? "Activa" : "Inactiva"}
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

      if (selectedCategories.length === 1) {
        // Delete a single category
        response = await dispatch(deleteCategory(selectedCategories[0]));
      } else {
        // Delete multiple categories
        response = await dispatch(deleteMultipleCategories(selectedCategories));
      }

      if (response?.error) {
        toast.error(response.error || 'Error al eliminar la categoría');
        return;
      }

      toast.success(
        selectedCategories.length === 1
          ? 'Categoría eliminada correctamente'
          : `${selectedCategories.length} categorías eliminadas correctamente`
      );
      await refetchCategory();
      setSelectedCategories([]);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error al eliminar categorías:', error);
      toast.error('Ocurrió un error al eliminar las categorías');
    }
  };

  const handleEditSelected = async () => {
    await refetch();
    setOpen(true);
  };

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("selectedCategories", selectedCategories);

  return (
    <>
      <CategoryModal open={open} handleToggle={handleToggle} category={category} />
      <DeleteConfirmationModal
        open={deleteModalOpen}
        handleClose={handleDeleteModalToggle}
        onConfirm={handleConfirmDelete}
        selectedItems={selectedCategories}
        itemType="categoría"
      />
      <Breadcrumb title="Categorías" />

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "10px 20px" }}>
                <TextField
                  label="Buscar categoría"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  margin="dense"
                />
                <div style={{ display: 'flex', alignItems: "center", gap: '12px' }}>
                  {
                    selectedCategories.length === 1 && <>
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
                rows={filteredCategories}
                columns={columns}
                initialState={{
                  pagination: { paginationModel }
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(selection) => {
                  let idsArray;

                  if (selection && typeof selection === 'object' && selection.type === 'include' && selection.ids) {
                    idsArray = Array.from(selection.ids || []);
                  } else {
                    idsArray = Array.from(selection || []);
                  }

                  setSelectedCategories(idsArray);
                }}
                sx={{
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  },
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
