// material-ui
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// ==============================|| CUSTOM SUB CARD ||============================== //

const SubCard = ({
  children,
  className,
  content = true,
  contentClass,
  darkTitle,
  secondary,
  sx = {},
  contentSX = {},
  footerSX = {},
  title,
  actions,
  ref,
  ...others
}) => {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark';
  const defaultShadow = '0 2px 14px 0 rgb(32 40 45 / 8%)';

  return (
    <Card ref={ref} sx={{ border: '1px solid', borderColor: 'divider', ':hover': { boxShadow: defaultShadow }, ...sx }} {...others}>
      {/* card header and action */}
      {!darkTitle && title && <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h5">{title}</Typography>} action={secondary} />}
      {darkTitle && title && <CardHeader sx={{ p: 2.5 }} title={<Typography variant="h4">{title}</Typography>} action={secondary} />}

      {/* content & header divider */}
      {title && <Divider sx={{ borderColor: isDarkMode ? 'grey.800' : 'grey.300' }}  />}

      {/* card content */}
      {content && (
        <CardContent sx={{ p: 2.5, ...contentSX }} className={contentClass || ''}>
          {children}
        </CardContent>
      )}
      {!content && children}

      {/* actions & footer divider */}
      {actions && <Divider sx={{ borderColor: isDarkMode ? 'grey.800' : 'grey.300' }}  />}

      {actions && <CardActions sx={{ p: 2.5, ...footerSX }}>{actions}</CardActions>}
    </Card>
  );
};
export default SubCard;
