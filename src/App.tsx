import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Link } from "react-router-dom";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Staff from "@/pages/Staff";
import Achievements from "@/pages/Achievements";
import Activities from "@/pages/Activities";
import Documents from "@/pages/Documents";
import Apply from "@/pages/Apply";
import Contact from "@/pages/Contact";
import {
  AdminLayout, AdminLogin, AdminDashboard,
  AdminNews, AdminHero, AdminStaff, AdminDocuments,
  AdminAchievements, AdminActivities, AdminApplications,
} from "@/pages/admin";

const queryClient = new QueryClient();

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 min-h-[60vh]">{children}</main>
      <SiteFooter />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[var(--foreground)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
            <Route path="/staff" element={<PublicLayout><Staff /></PublicLayout>} />
            <Route path="/achievements" element={<PublicLayout><Achievements /></PublicLayout>} />
            <Route path="/activities" element={<PublicLayout><Activities /></PublicLayout>} />
            <Route path="/documents" element={<PublicLayout><Documents /></PublicLayout>} />
            <Route path="/apply" element={<PublicLayout><Apply /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="login" element={<AdminLogin />} />
              <Route index element={<AdminDashboard />} />
              <Route path="news" element={<AdminNews />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="activities" element={<AdminActivities />} />
              <Route path="applications" element={<AdminApplications />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
