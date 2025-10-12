import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { artcaffeTheme } from './theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={artcaffeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

// Usage example for index.tsx or App.tsx:
/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './ThemeProvider';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
*/
