import { Link } from 'react-router-dom';

import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import AuthWrapper1 from './AuthWrapper1';
import AuthCardWrapper from './AuthCardWrapper';
import AuthLogin from '../auth-forms/AuthLogin';

import Logo from 'ui-component/Logo';
import AuthFooter from 'ui-component/cards/AuthFooter';
import { useTheme } from '@mui/material/styles';

// ================================|| AUTH3 - LOGIN ||================================ //

export default function Login() {
  const theme = useTheme();
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const isDarkMode = theme.palette.mode === 'dark';
  return (
    <AuthWrapper1>
      <Grid container direction="column" sx={{ justifyContent: 'flex-end', minHeight: '100vh' }}>
        <Grid size={12}>
          <Grid container sx={{ justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 68px)' }}>
            <Grid sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid container spacing={2} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Grid>
                    <Logo />
                  </Grid>
                  <Grid size={12}>
                    <Grid container direction={{ xs: 'column-reverse', md: 'row' }}
                          sx={{ alignItems: 'center', justifyContent: 'center' }}>
                      <Grid>
                        <Stack spacing={1} sx={{ alignItems: 'center', justifyContent: 'center' }}>
                          <Typography gutterBottom variant={downMD ? 'h3' : 'h2'} sx={{ color: 'secondary.main' }}>
                            Hi, Welcome Back
                          </Typography>
                          <Typography variant="caption"
                                      sx={{ fontSize: '16px', textAlign: { xs: 'center', md: 'inherit' } }}>
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid size={12}>
                    <AuthLogin />
                  </Grid>
                  <Grid size={12}>
                    <Divider sx={{ borderColor: isDarkMode ? 'grey.800' : 'grey.300' }} />
                  </Grid>
                </Grid>
              </AuthCardWrapper>

              <div className="barberContainer">

                <div className="ball"></div>

                <div className="endCap"></div>

                <div className="cap"></div>

                <div className="barberWrap">

                  <div className="barber"></div>

                </div>

                <div className="cap"></div>

                <div className="endCap"></div>

                <div className="ball"></div>

              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ px: 3, my: 3 }} size={12}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
}
