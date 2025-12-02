// material-ui
import { createTheme } from '@mui/material/styles';

// assets
import defaultColor from 'assets/scss/_themes-vars.module.scss';

// ==============================|| DEFAULT THEME - PALETTE ||============================== //

export default function Palette(mode, presetColor) {
  let colors;
  switch (presetColor) {
    case 'default':
    default:
      colors = defaultColor;
  }

  const isDarkMode = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      common: {
        black: colors.darkPaper
      },
      primary: {
        light: isDarkMode ? colors.darkPrimaryLight : colors.primaryLight,
        main: isDarkMode ? colors.darkPrimaryMain : colors.primaryMain,
        dark: isDarkMode ? colors.darkPrimaryDark : colors.primaryDark,
        200: isDarkMode ? colors.darkPrimary200 : colors.primary200,
        800: isDarkMode ? colors.darkPrimary800 : colors.primary800
      },
      secondary: {
        light: isDarkMode ? colors.darkSecondaryLight : colors.secondaryLight,
        main: isDarkMode ? colors.darkSecondaryMain : colors.secondaryMain,
        dark: isDarkMode ? colors.darkSecondaryDark : colors.secondaryDark,
        200: isDarkMode ? colors.darkSecondary200 : colors.secondary200,
        800: isDarkMode ? colors.darkSecondary800 : colors.secondary800
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark,
        contrastText: isDarkMode ? colors.darkTextPrimary : colors.grey700
      },
      success: {
        light: colors.successLight,
        200: colors.success200,
        main: colors.successMain,
        dark: colors.successDark
      },
      grey: {
        50: colors.grey50,
        100: isDarkMode ? colors.darkBackgroundDash :colors.grey100,
        500: colors.grey500,
        600: colors.grey600,
        700: colors.grey700,
        900: colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: isDarkMode ? colors.darkTextPrimary : colors.grey700,
        secondary: isDarkMode ? colors.darkTextSecondary : colors.grey500,
        dark: isDarkMode ? colors.darkTextTitle : colors.grey900,
        hint: colors.grey100
      },
      divider: isDarkMode ? colors.darkTextPrimary : colors.grey200,
      background: {
        paper: isDarkMode ? colors.darkPaper : colors.paper,
        default: isDarkMode ? colors.darkBackground : colors.paper
      }
    }
  });
}
