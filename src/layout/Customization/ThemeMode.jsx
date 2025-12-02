// material-ui
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// project imports
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| CUSTOMIZATION - THEME MODE ||============================== //

export default function ThemeMode() {
  const { mode, onChangeMode } = useConfig();

  return (
    <Stack spacing={2.5} sx={{ p: 2, width: '100%' }}>
      <Typography variant="h5">THEME MODE</Typography>
      <Grid container spacing={1.25}>
        <Grid size={12}>
          <MainCard content={false} sx={{ p: 0.75 }}>
            <MainCard
              content={false}
              border
              sx={{
                p: 1.75,
                borderWidth: 1
              }}
            >
              <FormControlLabel
                sx={{ width: 1 }}
                control={
                  <Switch
                    checked={mode === 'dark'}
                    onChange={onChangeMode}
                    name="theme-mode"
                    color="primary"
                  />
                }
                label={
                  <Typography variant="h5" sx={{ pl: 2 }}>
                    {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </Typography>
                }
              />
            </MainCard>
          </MainCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
