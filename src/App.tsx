// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {HelmetProvider} from "react-helmet-async"; // Import this
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
import Contact from "./pages/Contact";
import Docs from "./pages/Docs";
import { QuickStart } from "./pages/docs/QuickStart";
import { CLIDocs } from "./pages/docs/CLIDocs";

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
                        <Route path="/docs" element={<Docs/>}/>
                        <Route path="/docs/getting-started" element={<QuickStart/>}/>
                        <Route path="/docs/installation" element={<QuickStart/>}/>
                        <Route path="/docs/first-project" element={<QuickStart/>}/>
                        <Route path="/docs/environment-setup" element={<QuickStart/>}/>
                        <Route path="/docs/cli/installation" element={<CLIDocs initialSection="installation"/>}/>
                        <Route path="/docs/cli/authentication" element={<CLIDocs initialSection="authentication"/>}/>
                        <Route path="/docs/cli/project-management" element={<CLIDocs initialSection="project-management"/>}/>
                        <Route path="/docs/cli/variables" element={<CLIDocs initialSection="environment-variables"/>}/>
                        <Route path="/docs/cli/advanced" element={<CLIDocs initialSection="advanced"/>}/>
                        <Route path="/pricing" element={<Pricing/>}/>
                        <Route path="/about" element={<AboutUs/>}/>
                        <Route path="/privacy" element={<PrivacyPolicy/>}/>
                        <Route path="/terms" element={<TermsOfService/>}/>
                        <Route path="/contact" element={<Contact/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </HelmetProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
