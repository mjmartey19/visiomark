import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import AppProvider from './utils/Context';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <MantineProvider withNormalizeCSS>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId='931309954354-hgedvklrb9c4j9fqf7rdrp1jsrpku1qp.apps.googleusercontent.com'>
            <App />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </MantineProvider>
    </AppProvider>
  </React.StrictMode>
);
