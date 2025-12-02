// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

// third party
import Chart from 'react-apexcharts';

// chart data
import bestSellingProductsChartOptions from './chart-data/best-selling-products-chart';
import categoryDistributionChartOptions from './chart-data/category-distribution-chart';
import salesOverviewChartOptions from './chart-data/sales-overview-chart';

// icons
import { IconBottle, IconChartBar, IconCoin, IconAlertTriangle, IconShoppingCart, IconCategory } from '@tabler/icons-react';

// ==============================|| LIQUOR DELIVERY DASHBOARD ||============================== //

export default function SamplePage() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [isPageLoading, setPageLoading] = useState(true);

  // Fake data for dashboard
  const expiringProducts = [
    { id: 1, name: 'Whisky Escocés Premium', expiry: '2025-08-15', daysLeft: 24, stock: 5 },
    { id: 2, name: 'Ron Añejo Especial', expiry: '2025-08-10', daysLeft: 19, stock: 3 },
    { id: 3, name: 'Vodka Importado', expiry: '2025-08-05', daysLeft: 14, stock: 7 },
    { id: 4, name: 'Tequila Reposado', expiry: '2025-08-01', daysLeft: 10, stock: 2 }
  ];

  const bestSellingProductsData = [
    {
      name: 'Ventas (unidades)',
      data: [65, 59, 48, 42, 35]
    }
  ];

  const categoryDistributionData = [
    {
      name: 'Distribución',
      data: [35, 25, 15, 12, 8, 5]
    }
  ];

  const salesOverviewData = [
    {
      name: 'Ventas 2025',
      data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35]
    },
    {
      name: 'Ventas 2024',
      data: [28, 32, 45, 32, 34, 52, 41, 36, 26, 45, 49, 62]
    }
  ];

  useEffect(() => {
    setPageLoading(false);
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Products about to expire */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <MainCard
              title="Productos Próximos a Vencer"
              secondary={
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.warning.light,
                    color: theme.palette.warning.dark
                  }}
                >
                  <IconAlertTriangle fontSize="inherit" />
                </Avatar>
              }
            >
              <List sx={{ py: 0 }}>
                {expiringProducts.map((product, index) => (
                  <Box key={product.id}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.largeAvatar,
                            backgroundColor:
                              product.daysLeft <= 10
                                ? theme.palette.error.light
                                : product.daysLeft <= 20
                                  ? theme.palette.warning.light
                                  : theme.palette.success.light,
                            color:
                              product.daysLeft <= 10
                                ? theme.palette.error.dark
                                : product.daysLeft <= 20
                                  ? theme.palette.warning.dark
                                  : theme.palette.success.dark
                          }}
                        >
                          <IconBottle fontSize="inherit" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption">
                            Vence: {product.expiry} ({product.daysLeft} días) • Stock: {product.stock}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index !== expiringProducts.length - 1 && <Divider sx={{ borderColor: isDarkMode ? 'grey.800' : 'grey.300' }}  />}
                  </Box>
                ))}
              </List>
            </MainCard>
          </Grid>

          {/* Best selling products */}
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <MainCard
              title="Productos Más Vendidos"
              secondary={
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.dark
                  }}
                >
                  <IconChartBar fontSize="inherit" />
                </Avatar>
              }
            >
              <Chart
                options={bestSellingProductsChartOptions}
                series={bestSellingProductsData}
                type="bar"
                height={320}
              />
            </MainCard>
          </Grid>

          {/* Sales stats */}
          <Grid item lg={4} md={12} sm={12} xs={12}>
            <Grid container spacing={gridSpacing}>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <Card
                  sx={{
                    bgcolor: theme.palette.secondary.dark,
                    color: '#fff',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: 210,
                      height: 210,
                      background: theme.palette.secondary[800],
                      borderRadius: '50%',
                      top: { xs: -85 },
                      right: { xs: -95 }
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: 210,
                      height: 210,
                      background: theme.palette.secondary[800],
                      borderRadius: '50%',
                      top: { xs: -125 },
                      right: { xs: -15 },
                      opacity: 0.5
                    }
                  }}
                >
                  <CardContent>
                    <Grid container direction="column">
                      <Grid item>
                        <Grid container justifyContent="space-between">
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.largeAvatar,
                                bgcolor: theme.palette.secondary[800],
                                mt: 1
                              }}
                            >
                              <IconCoin fontSize="inherit" />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>$28,500</Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              sx={{
                                cursor: 'pointer',
                                ...theme.typography.smallAvatar,
                                bgcolor: theme.palette.secondary[200],
                                color: theme.palette.secondary.dark
                              }}
                            >
                              <IconChartBar fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sx={{ mb: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: theme.palette.secondary[200]
                          }}
                        >
                          Ventas Totales
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={6} xs={12} md={6} lg={12}>
                <Card
                  sx={{
                    bgcolor: theme.palette.primary.dark,
                    color: '#fff',
                    overflow: 'hidden',
                    position: 'relative',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: 210,
                      height: 210,
                      background: theme.palette.primary[800],
                      borderRadius: '50%',
                      top: { xs: -85 },
                      right: { xs: -95 }
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      width: 210,
                      height: 210,
                      background: theme.palette.primary[800],
                      borderRadius: '50%',
                      top: { xs: -125 },
                      right: { xs: -15 },
                      opacity: 0.5
                    }
                  }}
                >
                  <CardContent>
                    <Grid container direction="column">
                      <Grid item>
                        <Grid container justifyContent="space-between">
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.largeAvatar,
                                bgcolor: theme.palette.primary[800],
                                mt: 1
                              }}
                            >
                              <IconShoppingCart fontSize="inherit" />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item>
                        <Grid container alignItems="center">
                          <Grid item>
                            <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, mr: 1, mt: 1.75, mb: 0.75 }}>1,568</Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              sx={{
                                cursor: 'pointer',
                                ...theme.typography.smallAvatar,
                                bgcolor: theme.palette.primary[200],
                                color: theme.palette.primary.dark
                              }}
                            >
                              <IconChartBar fontSize="inherit" sx={{ transform: 'rotate3d(1, 1, 1, 45deg)' }} />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item sx={{ mb: 1.25 }}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: theme.palette.primary[200]
                          }}
                        >
                          Pedidos Totales
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Sales overview */}
          <Grid item xs={12} md={8}>
            <MainCard
              title="Resumen de Ventas"
              secondary={
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.secondary.light,
                    color: theme.palette.secondary.dark
                  }}
                >
                  <IconChartBar fontSize="inherit" />
                </Avatar>
              }
            >
              <Chart
                options={salesOverviewChartOptions}
                series={salesOverviewData}
                type="line"
                height={380}
              />
            </MainCard>
          </Grid>

          {/* Category distribution */}
          <Grid item xs={12} md={4}>
            <MainCard
              title="Distribución por Categoría"
              secondary={
                <Avatar
                  sx={{
                    cursor: 'pointer',
                    ...theme.typography.smallAvatar,
                    backgroundColor: theme.palette.primary.light,
                    color: theme.palette.primary.dark
                  }}
                >
                  <IconCategory fontSize="inherit" />
                </Avatar>
              }
            >
              <Chart
                options={categoryDistributionChartOptions}
                series={categoryDistributionData[0].data}
                type="pie"
                height={380}
              />
            </MainCard>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
