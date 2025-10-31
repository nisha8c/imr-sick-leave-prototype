import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import NotFound from "./pages/NotFound.tsx";
import Index from "./pages/Index.tsx";
import {TooltipProvider} from "@radix-ui/react-tooltip";
import {Toaster} from "./components/ui/toaster.tsx";
import { Toaster as Sonner } from "./components/ui/sonner";

function App() {
  return (
    <>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </>
  )
}

export default App
