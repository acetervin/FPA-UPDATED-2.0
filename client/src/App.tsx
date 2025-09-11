import { Switch, Route, useLocation } from "wouter";
import { Suspense, lazy } from 'react';


// Core Pages (Not Lazy Loaded)
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

// Lazy Loaded Pages
const About = lazy(() => import("@/pages/About"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Team = lazy(() => import("@/pages/Team"));
const TeamMember = lazy(() => import("@/pages/TeamMember"));
const Features = lazy(() => import("@/pages/Features"));
const GetInvolved = lazy(() => import("@/pages/GetInvolved"));
const Donate = lazy(() => import("@/pages/Donate"));
const Causes = lazy(() => import("@/pages/Causes"));
const CausePage = lazy(() => import("@/pages/CausePage"));
const Contact = lazy(() => import("@/pages/Contact"));
const Legal = lazy(() => import("@/pages/Legal"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Events = lazy(() => import("@/pages/Events"));
const EventDetail = lazy(() => import("@/pages/EventDetail"));
const EventRegistration = lazy(() => import("@/pages/EventRegistration"));

// Admin Pages (Lazy Loaded)
const AdminLogin = lazy(() => import("@/pages/admin/login"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const AdminBlogPosts = lazy(() => import("@/pages/admin/blog-posts"));
const AdminEvents = lazy(() => import("@/pages/admin/events"));
const AdminDonations = lazy(() => import("@/pages/admin/donations"));
const AdminUsers = lazy(() => import("@/pages/admin/users"));
const AdminVolunteers = lazy(() => import("@/pages/admin/volunteers"));
const AdminSettings = lazy(() => import("@/pages/admin/settings"));
const AdminPayments = lazy(() => import("@/pages/admin/payments"));
const AdminEventRegistrations = lazy(() => import("@/pages/admin/event-registrations"));

// Components

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import EventPopup from "@/components/EventPopup";

import ProtectedRoute from "@/components/admin/ProtectedRoute";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

function Router() {
  const [location] = useLocation();
  return (
    <>
      {!location.startsWith('/admin') && <Header />}
      <ScrollToTop />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about">
            {() => (
              <Suspense fallback={<LoadingSpinner />}>
                <About />
              </Suspense>
            )}
          </Route>
          <Route path="/blog">
            {() => (
              <Suspense fallback={<LoadingSpinner />}>
                <Blog />
              </Suspense>
            )}
          </Route>
            <Route path="/blog/:slug">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <BlogPost />
                </Suspense>
              )}
            </Route>
            <Route path="/team">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Team />
                </Suspense>
              )}
            </Route>
            <Route path="/team/:slug">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <TeamMember />
                </Suspense>
              )}
            </Route>
            <Route path="/features">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Features />
                </Suspense>
              )}
            </Route>
            <Route path="/get-involved">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <GetInvolved />
                </Suspense>
              )}
            </Route>
            <Route path="/donate">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Donate />
                </Suspense>
              )}
            </Route>
            <Route path="/causes">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Causes />
                </Suspense>
              )}
            </Route>
            <Route path="/causes/:slug">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <CausePage />
                </Suspense>
              )}
            </Route>
            <Route path="/contact">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Contact />
                </Suspense>
              )}
            </Route>
            <Route path="/legal">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Legal />
                </Suspense>
              )}
            </Route>
            <Route path="/gallery">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Gallery />
                </Suspense>
              )}
            </Route>
            <Route path="/events">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <Events />
                </Suspense>
              )}
            </Route>
            <Route path="/events/:slug">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <EventDetail />
                </Suspense>
              )}
            </Route>
            <Route path="/event-registration">
              {() => (
                <Suspense fallback={<LoadingSpinner />}>
                  <EventRegistration />
                </Suspense>
              )}
            </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login">
            {() => (
              <Suspense fallback={<LoadingSpinner />}>
                <AdminLogin />
              </Suspense>
            )}
          </Route>
          <Route path="/admin/dashboard">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDashboard />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/blog">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminBlogPosts />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/events">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminEvents />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/donations">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminDonations />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/users">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminUsers />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/volunteers">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminVolunteers />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/settings">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminSettings />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/payments">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminPayments />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/admin/event-registrations">
            {() => (
              <ProtectedRoute requireAdmin>
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminEventRegistrations />
                </Suspense>
              </ProtectedRoute>
            )}
          </Route>
          <Route>
            {() => (
              <Suspense fallback={<LoadingSpinner />}>
                <NotFound />
              </Suspense>
            )}
          </Route>
        </Switch>
      </main>
      {!location.startsWith('/admin') && <Footer />}
      {!location.startsWith('/admin') && <EventPopup />}
    </>
  );
}


function App() {
  return <Router />;
}


export default App;
