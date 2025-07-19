
// Copyright (c) 2025 Misbah Sarfaraz msbahsarfaraz@gmail.com
// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.

import {HelmetProvider} from "react-helmet-async";
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
import SecurityDocs from "./pages/docs/security/SecurityDocs";
import TeamDocs from "./pages/docs/team/TeamDocs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";

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
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/project/:projectId" element={<ProjectPage/>}/>
                        <Route path="/docs" element={<Docs/>}/>
                        
                        {/* Getting Started Routes */}
                        <Route path="/docs/getting-started" element={<QuickStart/>}/>
                        <Route path="/docs/getting-started/introduction" element={<QuickStart initialSection="introduction"/>}/>
                        <Route path="/docs/getting-started/installation" element={<QuickStart initialSection="installation"/>}/>
                        <Route path="/docs/getting-started/usage" element={<QuickStart initialSection="usage"/>}/>
                        
                        {/* CLI Documentation Routes */}
                        <Route path="/docs/cli/installation" element={<CLIDocs initialSection="installation"/>}/>
                        <Route path="/docs/cli/authentication" element={<CLIDocs initialSection="authentication"/>}/>
                        <Route path="/docs/cli/project-management" element={<CLIDocs initialSection="project-management"/>}/>
                        <Route path="/docs/cli/variables" element={<CLIDocs initialSection="environment-variables"/>}/>
                        
                        {/* Security Documentation Routes */}
                        <Route path="/docs/security" element={<SecurityDocs/>}/>
                        <Route path="/docs/security/encryption" element={<SecurityDocs initialSection="encryption"/>}/>
                        <Route path="/docs/security/access-control" element={<SecurityDocs initialSection="access-control"/>}/>
                        <Route path="/docs/security/best-practices" element={<SecurityDocs initialSection="best-practices"/>}/>
                        <Route path="/docs/security/security-measures" element={<SecurityDocs initialSection="security-measures"/>}/>
                        
                        {/* Team Documentation Routes */}
                        <Route path="/docs/team" element={<TeamDocs/>}/>
                        <Route path="/docs/team/getting-started" element={<TeamDocs initialSection="introduction"/>}/>
                        <Route path="/docs/team/members" element={<TeamDocs initialSection="members"/>}/>
                        <Route path="/docs/team/access-control" element={<TeamDocs initialSection="access-control"/>}/>
                        <Route path="/docs/team/best-practices" element={<TeamDocs initialSection="best-practices"/>}/>
                        
                        {/* Other Pages */}
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
