import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Libraries //
import ReCAPTCHA from 'react-google-recaptcha';
import { useDispatch, useSelector } from 'react-redux';

// Redux //
import { login } from '../../../redux/session/actions';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const initialValuesLogin = {
  email: 'nicolassanchez115@hotmail.com',
  password: '121125',
  recaptchaToken: null
};

export default function AuthLogin() {
  const { user } = useSelector(({ session }) => session);

  const navigate = useNavigate();

  const theme = useTheme();

  const dispatch = useDispatch();

  const [checked, setChecked] = useState(false);
  const [data, setData] = useState(initialValuesLogin);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user?.token) navigate('/');
  }, [user?.token, navigate]);

  const { email, password, recaptchaToken } = data;

  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleCaptchaChange = (token) => setData({ ...data, recaptchaToken: token });

  const onSubmit = async () => dispatch(login(data));

  return (
    <>
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
        <OutlinedInput
          id="outlined-adornment-email-login"
          type="email"
          onChange={({ target }) => setData({ ...data, email: target.value })}
          value={email}
          name="email"
          placeholder="info@tenampa.com"
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={({ target }) => setData({ ...data, password: target.value })}
          name="password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>

      <div style={{ display: 'flex', marginTop: 2 }}>
        <ReCAPTCHA sitekey={`${import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY}`} onChange={handleCaptchaChange} style={{ margin: 'auto' }} />
      </div>

      <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Grid>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)} name="checked" color="primary" />}
            label="Keep me logged in"
          />
        </Grid>
        <Grid>
          <Typography variant="subtitle1" component={Link} color="secondary" sx={{ textDecoration: 'none' }}>
            Forgot Password?
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <AnimateButton>
          <Button
            color="secondary"
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={onSubmit}
            disabled={!email || !password || !recaptchaToken}
          >
            Sign In
          </Button>
        </AnimateButton>
      </Box>
    </>
  );
}
