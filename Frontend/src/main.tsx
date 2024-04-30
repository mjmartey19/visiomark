import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppProvider from './utils/Context';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <MantineProvider withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </MantineProvider>
    </AppProvider>
  </React.StrictMode>
);
