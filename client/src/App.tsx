import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Helmet } from "react-helmet";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Team from "@/pages/Team";
import TeamMember from "@/pages/TeamMember";
import Features from "@/pages/Features";
import GetInvolved from "@/pages/GetInvolved";
import Donate from "@/pages/Donate";
import Causes from "@/pages/Causes";
import CausePage from "@/pages/CausePage";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import Gallery from "@/pages/Gallery";
import NotFound from "@/pages/not-found";
import EventRegistration from "@/pages/EventRegistration";

// Admin Pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBlogPosts from "@/pages/admin/blog-posts";
import AdminEvents from "@/pages/admin/events";
import AdminDonations from "@/pages/admin/donations";
import AdminUsers from "@/pages/admin/users";
import AdminVolunteers from "@/pages/admin/volunteers";
import AdminSettings from "@/pages/admin/settings";

// Components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/admin/ProtectedRoute";

function Router() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/blog" component={Blog} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/team" component={Team} />
          <Route path="/team/:slug" component={TeamMember} />
          <Route path="/features" component={Features} />
          <Route path="/get-involved" component={GetInvolved} />
          <Route path="/donate" component={Donate} />
          <Route path="/causes" component={Causes} />
          <Route path="/causes/:slug" component={CausePage} />
          <Route path="/contact" component={Contact} />
          <Route path="/legal" component={Legal} />
          <Route path="/gallery" component={Gallery} />
          <Route path="/event-registration" component={EventRegistration} />
          
          {/* Admin Routes */}
          <Route path="/admin/login">
            {() => <AdminLogin />}
          </Route>
          <Route path="/admin/dashboard">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/blog">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminBlogPosts />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/events">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminEvents />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/donations">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminDonations />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/users">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminUsers />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/volunteers">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminVolunteers />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/settings">
            {() => (
              <ProtectedRoute requireAdmin>
                <AdminSettings />
              </ProtectedRoute>
            )}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
      {!location.pathname.startsWith('/admin') && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Helmet>
            <html lang="en" />
          </Helmet>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
