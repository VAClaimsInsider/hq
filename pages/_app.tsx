import { useMemo } from 'react';
import type { AppProps } from 'next/app'
import { ThemeProvider, CssBaseline, useMediaQuery, colors } from '@mui/material';
import { createTheme } from '@mui/material/styles';

// import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
          primary: {
            main: colors.red[500],
          },
        },
      }),
    [prefersDarkMode],
  );

  return <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
}
