import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Builder from "./pages/Builder";
import GroupGenerator from "./pages/GroupGenerator";
import RandomNamePicker from "./pages/RandomNamePicker";
import HowToGroupStudents from "./pages/HowToGroupStudents";
import HowToMakeClassSchedule from "./pages/HowToMakeClassSchedule";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/classroom-schedule-maker" element={<Builder />} />
          
          <Route path="/random-group-generator" element={<GroupGenerator />} />
          <Route path="/random-name-picker" element={<RandomNamePicker />} />
          <Route path="/blog/randomly-group-students" element={<HowToGroupStudents />} />
          <Route path="/blog/how-to-randomly-group-students" element={<Navigate to="/blog/randomly-group-students" replace />} />
          <Route path="/blog/how-to-make-a-class-schedule" element={<HowToMakeClassSchedule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
