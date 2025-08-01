import React from "react";
import { createRoot } from "react-dom/client";
import { Helmet } from "react-helmet";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { ThemeProvider } from "@/components/ThemeProvider";
import PayPalProvider from "@/components/PayPalProvider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <PayPalProvider>
          <TooltipProvider>
            <Helmet>
              <html lang="en" />
            </Helmet>
            <Toaster />
            <App />
          </TooltipProvider>
        </PayPalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
