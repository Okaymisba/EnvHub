import {HelmetProvider} from "react-helmet-async"; // ✅ Import this
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ProjectPage from "./pages/ProjectPage";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <HelmetProvider>
                <Toaster/>
                <Sonner/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index/>}/>
                        <Route path="/project/:projectId" element={<ProjectPage/>}/>
                        <Route path="/pricing" element={<Pricing/>}/>
                        <Route path="/about" element={<AboutUs/>}/>
                        <Route path="/privacy" element={<PrivacyPolicy/>}/>
                        <Route path="/terms" element={<TermsOfService/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </HelmetProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
