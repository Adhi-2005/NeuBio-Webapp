import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/navbar";
import Register from "@/pages/register";
import Login from "@/pages/login";
import ForgotPassword from "@/pages/forgot-password";
import Onboarding from "@/pages/onboarding";
import Status from "@/pages/status";
import Journal from "@/pages/journal";
import Device from "@/pages/device";
import NotFound from "@/pages/not-found";

import Milestones from "@/pages/milestones";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/status" component={Status} />
      <Route path="/onboarding" component={Onboarding} />
      
      <Route path="/journal">
        {() => (
          <>
            <Navbar />
            <Journal />
          </>
        )}
      </Route>
      
      <Route path="/device">
        {() => (
          <>
            <Navbar />
            <Device />
          </>
        )}
      </Route>

      <Route path="/milestones">
        {() => (
          <>
            <Navbar />
            <Milestones />
          </>
        )}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
