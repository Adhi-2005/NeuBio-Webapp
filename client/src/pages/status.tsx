import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, AlertCircle, FileText, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

type ApplicationStatus = "pending" | "review" | "approved" | "declined" | "successful";

export default function ApplicationStatus() {
  const [, setLocation] = useLocation();
  // In a real app, this would come from the backend
  const [status, setStatus] = useState<ApplicationStatus>("review");

  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          color: "text-chart-5",
          bgColor: "bg-chart-5/20",
          title: "Application Pending",
          description: "Your application has been submitted and is awaiting initial review.",
          message: "Thank you for submitting your application. Our team will review your documents shortly.",
          step: 1
        };
      case "review":
        return {
          icon: FileText,
          color: "text-chart-2",
          bgColor: "bg-chart-2/20",
          title: "Under Review",
          description: "Your application is currently being reviewed by our specialists.",
          message: "We are currently assessing your application and medical records. This process typically takes 3-5 business days.",
          step: 2
        };
      case "approved":
      case "successful":
        return {
          icon: CheckCircle2,
          color: "text-chart-3",
          bgColor: "bg-chart-3/20",
          title: "Application Approved",
          description: "Congratulations! Your application has been approved.",
          message: "We are pleased to inform you that your application has been successful. You can now proceed to the next steps.",
          step: 3
        };
      case "declined":
        return {
          icon: XCircle,
          color: "text-destructive",
          bgColor: "bg-destructive/20",
          title: "Application Declined",
          description: "Unfortunately, your application could not be processed at this time.",
          message: "Please contact our support team for more information regarding your application status.",
          step: 3
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black uppercase tracking-tight">Status</h1>
        <Button variant="ghost" className="rounded-full" onClick={() => setLocation("/journal")}>
          Skip to Journal
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
        <div className={`w-32 h-32 ${config.bgColor} rounded-full flex items-center justify-center animate-in zoom-in duration-500`}>
          <StatusIcon className={`w-16 h-16 ${config.color}`} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tight leading-tight">{config.title}</h2>
          <p className="text-muted-foreground font-medium text-lg">
            {config.description}
          </p>
        </div>

        <div className="bg-muted/30 p-6 rounded-3xl w-full">
          <p className="text-muted-foreground font-medium leading-relaxed">
            {config.message}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="w-full relative pt-8 pb-4">
          <div className="absolute top-1/2 left-0 w-full h-2 bg-muted rounded-full -translate-y-1/2 z-0" />
          <div className="relative z-10 flex justify-between px-2">
            {["Submitted", "Review", "Decision"].map((step, index) => {
              const stepNum = index + 1;
              const isCompleted = config.step > stepNum || (config.step === stepNum && status !== "declined");
              const isCurrent = config.step === stepNum;
              const isError = status === "declined" && stepNum === 3;

              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-4 font-bold text-sm transition-all duration-500 bg-background
                    ${isError ? "border-destructive text-destructive" : 
                      isCompleted ? "border-primary bg-primary text-primary-foreground" : 
                      isCurrent ? "border-primary text-primary" : "border-muted text-muted-foreground"}
                  `}>
                    {isCompleted || isError ? (isError ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />) : stepNum}
                  </div>
                  <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {status === "approved" && (
        <div className="mt-8">
          <Button className="w-full rounded-full h-14 text-lg font-bold uppercase tracking-wide" onClick={() => setLocation("/onboarding")}>
            Continue Onboarding <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Demo Controls - For presentation purposes */}
      <div className="mt-8 p-4 rounded-3xl bg-muted/20 border-2 border-dashed border-muted">
        <p className="text-xs font-bold uppercase text-muted-foreground mb-3 text-center">Demo Controls</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setStatus("pending")}>Pending</Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setStatus("review")}>Review</Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setStatus("approved")}>Approved</Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => setStatus("declined")}>Declined</Button>
        </div>
      </div>
    </div>
  );
}
