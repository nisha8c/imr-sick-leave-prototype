import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {httpBatchLink} from "@trpc/client";
import {trpc} from "./utils/trpc.ts";
import "./i18n/config";

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
    links: [
        httpBatchLink({
            url: "http://localhost:4000/trpc",
        }),
    ],
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
              <App />
          </QueryClientProvider>
      </trpc.Provider>
  </StrictMode>,
)
