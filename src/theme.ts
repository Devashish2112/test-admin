import { createTheme, ThemeOptions, alpha } from '@mui/material/styles';

const commonThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.015em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.875rem',
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
        },
        '#root': {
          height: '100%',
        },
        'input:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
        },
        '*::-webkit-scrollbar-track': {
          borderRadius: '8px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 8px 16px -4px rgba(58, 53, 65, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 18px 0px rgba(15, 20, 34, 0.08)',
          transition: 'box-shadow 0.25s ease-in-out, transform 0.25s ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 6px 24px 0px rgba(15, 20, 34, 0.12)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 4px 0 rgba(15, 20, 34, 0.05)',
        },
        elevation2: {
          boxShadow: '0 4px 8px 0 rgba(15, 20, 34, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid',
          padding: '16px',
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'currentColor',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(58, 53, 65, 0.2)',
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          '&.Mui-selected': {
            backgroundColor: 'rgba(58, 53, 65, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 10px 40px 0px rgba(15, 20, 34, 0.15)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
          fontSize: '1.25rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(58, 53, 65, 0.12)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid',
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 2px 14px 0 rgba(15, 20, 34, 0.2)',
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
        arrow: {
          color: 'inherit',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#3F51B5', // Indigo
      light: '#7986CB',
      dark: '#303F9F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF5722', // Deep Orange
      light: '#FF8A65',
      dark: '#E64A19',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    background: {
      default: '#F5F7FB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3A3541DE',
      secondary: '#3A354199',
      disabled: '#3A354161',
    },
    divider: 'rgba(58, 53, 65, 0.12)',
    action: {
      active: '#3A3541DE',
      hover: 'rgba(58, 53, 65, 0.04)',
      selected: 'rgba(58, 53, 65, 0.08)',
      disabled: 'rgba(58, 53, 65, 0.26)',
      disabledBackground: 'rgba(58, 53, 65, 0.12)',
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(15, 20, 34, 0.08)',
    '0px 4px 8px rgba(15, 20, 34, 0.08)',
    '0px 6px 12px rgba(15, 20, 34, 0.08)',
    '0px 8px 16px rgba(15, 20, 34, 0.1)',
    '0px 10px 20px rgba(15, 20, 34, 0.1)',
    '0px 12px 24px rgba(15, 20, 34, 0.12)',
    '0px 14px 28px rgba(15, 20, 34, 0.12)',
    '0px 16px 32px rgba(15, 20, 34, 0.14)',
    '0px 18px 36px rgba(15, 20, 34, 0.14)',
    '0px 20px 40px rgba(15, 20, 34, 0.16)',
    '0px 22px 44px rgba(15, 20, 34, 0.16)',
    '0px 24px 48px rgba(15, 20, 34, 0.18)',
    '0px 26px 52px rgba(15, 20, 34, 0.18)',
    '0px 28px 56px rgba(15, 20, 34, 0.2)',
    '0px 30px 60px rgba(15, 20, 34, 0.2)',
    '0px 32px 64px rgba(15, 20, 34, 0.22)',
    '0px 34px 68px rgba(15, 20, 34, 0.22)',
    '0px 36px 72px rgba(15, 20, 34, 0.24)',
    '0px 38px 76px rgba(15, 20, 34, 0.24)',
    '0px 40px 80px rgba(15, 20, 34, 0.26)',
    '0px 42px 84px rgba(15, 20, 34, 0.26)',
    '0px 44px 88px rgba(15, 20, 34, 0.28)',
    '0px 46px 92px rgba(15, 20, 34, 0.28)',
    '0px 48px 96px rgba(15, 20, 34, 0.3)',
  ],
});

export const darkTheme = createTheme({
  ...commonThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#7986CB', // Lighter Indigo for dark theme
      light: '#9FA8DA',
      dark: '#5C6BC0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF8A65', // Lighter Deep Orange for dark theme
      light: '#FFAB91',
      dark: '#FF7043',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF5350',
      light: '#E57373',
      dark: '#E53935',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#FF9800',
    },
    info: {
      main: '#42A5F5',
      light: '#64B5F6',
      dark: '#2196F3',
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#4CAF50',
    },
    background: {
      default: '#1A1E2A',
      paper: '#252B3B',
    },
    text: {
      primary: '#E7E3FCDE',
      secondary: '#E7E3FC99',
      disabled: '#E7E3FC61',
    },
    divider: 'rgba(231, 227, 252, 0.12)',
    action: {
      active: '#E7E3FCDE',
      hover: 'rgba(231, 227, 252, 0.08)',
      selected: 'rgba(231, 227, 252, 0.16)',
      disabled: 'rgba(231, 227, 252, 0.3)',
      disabledBackground: 'rgba(231, 227, 252, 0.12)',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          height: '100%',
          width: '100%',
        },
        body: {
          height: '100%',
          margin: 0,
          padding: 0,
        },
        '#root': {
          height: '100%',
        },
        'input:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 100px transparent inset !important',
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: '8px',
          backgroundColor: 'rgba(231, 227, 252, 0.2)',
        },
        '*::-webkit-scrollbar-track': {
          borderRadius: '8px',
          backgroundColor: 'rgba(231, 227, 252, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          padding: '10px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          '&:hover': {
            boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '1.5px',
          '&:hover': {
            borderWidth: '1.5px',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 18px 0px rgba(0, 0, 0, 0.15)',
          transition: 'box-shadow 0.25s ease-in-out, transform 0.25s ease-in-out',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 6px 24px 0px rgba(0, 0, 0, 0.2)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.15)',
        },
        elevation2: {
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(231, 227, 252, 0.12)',
          padding: '16px',
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.2s ease',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'currentColor',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: 2,
          },
        },
        notchedOutline: {
          borderColor: 'rgba(231, 227, 252, 0.2)',
          transition: 'border-color 0.2s ease-in-out',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          '&.Mui-selected': {
            backgroundColor: 'rgba(231, 227, 252, 0.16)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 10px 40px 0px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '20px 24px 12px',
          fontSize: '1.25rem',
          fontWeight: 600,
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 24px',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(231, 227, 252, 0.12)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '2px solid rgba(231, 227, 252, 0.2)',
          fontWeight: 600,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: '0 2px 14px 0 rgba(0, 0, 0, 0.3)',
          padding: '8px 12px',
          fontSize: '0.75rem',
        },
        arrow: {
          color: 'inherit',
        },
      },
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 6px 12px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.25)',
    '0px 10px 20px rgba(0, 0, 0, 0.25)',
    '0px 12px 24px rgba(0, 0, 0, 0.3)',
    '0px 14px 28px rgba(0, 0, 0, 0.3)',
    '0px 16px 32px rgba(0, 0, 0, 0.35)',
    '0px 18px 36px rgba(0, 0, 0, 0.35)',
    '0px 20px 40px rgba(0, 0, 0, 0.4)',
    '0px 22px 44px rgba(0, 0, 0, 0.4)',
    '0px 24px 48px rgba(0, 0, 0, 0.45)',
    '0px 26px 52px rgba(0, 0, 0, 0.45)',
    '0px 28px 56px rgba(0, 0, 0, 0.5)',
    '0px 30px 60px rgba(0, 0, 0, 0.5)',
    '0px 32px 64px rgba(0, 0, 0, 0.55)',
    '0px 34px 68px rgba(0, 0, 0, 0.55)',
    '0px 36px 72px rgba(0, 0, 0, 0.6)',
    '0px 38px 76px rgba(0, 0, 0, 0.6)',
    '0px 40px 80px rgba(0, 0, 0, 0.65)',
    '0px 42px 84px rgba(0, 0, 0, 0.65)',
    '0px 44px 88px rgba(0, 0, 0, 0.7)',
    '0px 46px 92px rgba(0, 0, 0, 0.7)',
    '0px 48px 96px rgba(0, 0, 0, 0.75)',
  ],
}); 