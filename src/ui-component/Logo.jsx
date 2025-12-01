import { useTheme } from '@mui/material/styles';
import logo from 'assets/images/barber-logo.png';

export default function Logo() {
  const theme = useTheme();

  return (
    <img
      src={logo}
      alt="Tenampa"
      width="60%"
    />
  );
}
