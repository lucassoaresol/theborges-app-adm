import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Router } from './Router';
import { Appbar } from './components/Appbar';
import { Toaster } from './components/ui/Toaster';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      refetchOnWindowFocus: false,
      gcTime: 10 * 60 * 1000,
      retry: false
    },
    mutations: {},
  },
});

export function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Appbar />

          <BrowserRouter>
            <Router />
            <ReactQueryDevtools buttonPosition="bottom-left" position="left" />
          </BrowserRouter>

          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
