import { useNavigate } from 'react-router-dom';
// material-ui
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';

// constant
const headerStyle = {
  '& .MuiCardHeader-action': { mr: 0 }
};

const Breadcrumb = function Breadcrumb({
  border = false,
  boxShadow,
  children,
  content = true,
  contentClass = '',
  contentSX = {},
  headerSX = {},
  darkTitle,
  secondary,
  shadow,
  sx = {},
  title,
  ref,
  ...others
}) {
  const defaultShadow = '0 2px 14px 0 rgb(32 40 45 / 8%)';

  const navigate = useNavigate();

  const breadcrumbs = [
    <Link sx={{ display: 'flex' }} underline="hover" key="1" color="inherit" href="/" onClick={() => navigate('/dashboard/default')}>
      <HomeIcon
        sx={{
          width: 20,
          height: 20,
          color: 'secondary.dark',
          '&:hover': {
            color: 'secondary.light'
          }
        }}
        fontSize={'inherit'}
      />
    </Link>,
    <Typography key="3" sx={{ color: 'text.primary' }}>
      {title}
    </Typography>
  ];

  return (
    <Card
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: 'divider',
        ':hover': {
          boxShadow: boxShadow ? shadow || defaultShadow : 'inherit'
        },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...sx
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader
          sx={{ ...headerStyle, ...headerSX, padding: '10px 20px' }}
          title={<Typography variant="h5">{title}</Typography>}
          action={secondary}
        />
      )}
      {darkTitle && title && (
        <CardHeader sx={{ ...headerStyle, ...headerSX }} title={<Typography variant="h5">{title}</Typography>} action={secondary} />
      )}

      <Stack spacing={2} sx={{ padding: '0 20px' }}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </Stack>
    </Card>
  );
};

export default Breadcrumb;
