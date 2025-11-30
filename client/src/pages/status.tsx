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
          color: "text-yellow-500",
          bgColor: "bg-yellow-100",
          title: "Application Pending",
          description: "Your application has been submitted and is awaiting initial review.",
          message: "Thank you for submitting your application. Our team will review your documents shortly.",
          step: 1
        };
      case "review":
        return {
          icon: FileText,
          color: "text-blue-500",
          bgColor: "bg-blue-100",
          title: "Under Review",
          description: "Your application is currently being reviewed by our specialists.",
          message: "We are currently assessing your application and medical records. This process typically takes 3-5 business days.",
          step: 2
        };
      case "approved":
      case "successful":
        return {
          icon: CheckCircle2,
          color: "text-green-500",
          bgColor: "bg-green-100",
          title: "Application Approved",
          description: "Congratulations! Your application has been approved.",
          message: "We are pleased to inform you that your application has been successful. You can now proceed to the next steps.",
          step: 3
        };
      case "declined":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-100",
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Application Status</h1>
          <Button variant="outline" onClick={() => setLocation("/journal")}>
            Go to Journal
          </Button>
        </div>

        <Card className="border-2">
          <CardHeader className="text-center pb-2">
            <div className={`mx-auto w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mb-4`}>
              <StatusIcon className={`w-10 h-10 ${config.color}`} />
            </div>
            <CardTitle className="text-3xl">{config.title}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {config.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 p-6 rounded-xl text-center">
              <p className="text-muted-foreground leading-relaxed">
                {config.message}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="relative pt-8 pb-4">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
              <div className="relative z-10 flex justify-between">
                {["Submitted", "Under Review", "Decision"].map((step, index) => {
                  const stepNum = index + 1;
                  const isCompleted = config.step > stepNum || (config.step === stepNum && status !== "declined");
                  const isCurrent = config.step === stepNum;
                  const isError = status === "declined" && stepNum === 3;

                  return (
                    <div key={step} className="flex flex-col items-center bg-background px-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors
                        ${isError ? "border-red-500 bg-red-500 text-white" : 
                          isCompleted ? "border-green-500 bg-green-500 text-white" : 
                          isCurrent ? "border-blue-500 bg-background text-blue-500" : "border-muted bg-background text-muted-foreground"}
                      `}>
                        {isCompleted || isError ? (isError ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />) : stepNum}
                      </div>
                      <span className={`mt-2 text-sm font-medium ${isCurrent ? "text-foreground" : "text-muted-foreground"}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {status === "approved" && (
              <Button className="w-full" size="lg" onClick={() => setLocation("/onboarding")}>
                Continue Onboarding <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Demo Controls - For presentation purposes */}
        <Card className="bg-muted/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Demo Controls (For Testing)</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setStatus("pending")}>Set Pending</Button>
            <Button variant="outline" size="sm" onClick={() => setStatus("review")}>Set Review</Button>
            <Button variant="outline" size="sm" onClick={() => setStatus("approved")}>Set Approved</Button>
            <Button variant="outline" size="sm" onClick={() => setStatus("declined")}>Set Declined</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
