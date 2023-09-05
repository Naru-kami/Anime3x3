import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useStore } from '../Store/Store';

export default function DarkTheme({ children }: { children: React.ReactNode }) {
  const [theme] = useStore(store => store.darkTheme);
  const darkTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 800,
        lg: 1200,
        xl: 1536,
      },
    },
    palette: {
      mode: theme ? 'dark' : 'light',
      background: {
        default: theme ? '#0c0f1e' : '#0000000d',
        paper: theme ? '#0c0f1e' : '#fff',
      },
      primary: {
        main: '#307ac3',
      },
      secondary: {
        main: '#1B1D2A',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            backgroundColor: theme ? '#ffffff18' : '#fff',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: theme ? '1px solid #ffffff20' : '1px solid #00000030',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '0',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            ":hover": {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
