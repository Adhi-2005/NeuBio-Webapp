import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Dot, Info, FileText, HelpCircle, Upload } from "lucide-react";
import BeneficiaryForm from "./beneficiary-form";
import Questionnaire from "./questionnaire";
import Documents from "./documents";

const steps = [
  { id: 1, title: "Overview", description: "Process Overview" },
  { id: 2, title: "Profile", description: "Basic Information" },
  { id: 3, title: "Questionnaire", description: "Parent Readiness" },
  { id: 4, title: "Documents", description: "Upload Required Files" },
  { id: 5, title: "Review", description: "Review & Submit" },
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final submission
      setLocation("/status");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="container mx-auto p-4 max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome to the Application Process</CardTitle>
                <CardDescription className="text-center">
                  Please review the steps below to understand what is required to complete your application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="border-none shadow-none bg-muted/30">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-lg">1. Beneficiary Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      Provide basic information about the beneficiary (child) and the insured family member.
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <HelpCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">2. Questionnaire</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      Answer a series of questions to help us understand your readiness and commitment.
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-none bg-muted/30">
                    <CardHeader className="text-center pb-2">
                      <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                        <Upload className="w-6 h-6 text-orange-600" />
                      </div>
                      <CardTitle className="text-lg">3. Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      Upload necessary documents such as identification and medical records.
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex gap-3 items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    You can save your progress at any time and return later. Please ensure all information provided is accurate.
                  </p>
                </div>

                <Button size="lg" className="w-full" onClick={handleNext}>
                  Start Application
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case 2:
        return <BeneficiaryForm onNext={handleNext} />;
      case 3:
        return <Questionnaire onNext={handleNext} />;
      case 4:
        return <Documents onNext={handleNext} />;
      case 5:
        return (
          <div className="container mx-auto p-4 max-w-2xl text-center">
            <Card>
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Ready to Submit?</CardTitle>
                <CardDescription>
                  You have completed all the required steps. Please review your information before final submission.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg text-left space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Beneficiary Profile Completed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Questionnaire Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Documents Uploaded</span>
                  </div>
                </div>
                
                <Button size="lg" className="w-full" onClick={handleNext}>
                  Submit Application
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Stepper Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-center md:justify-between">
            <div className="hidden md:block">
              <h1 className="text-xl font-bold">Application Process</h1>
              <p className="text-sm text-muted-foreground">Complete all steps to apply</p>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-2 ${currentStep === step.id ? "text-primary" : "text-muted-foreground"}`}>
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium
                      ${currentStep === step.id ? "border-primary bg-primary/10" : 
                        currentStep > step.id ? "border-primary bg-primary text-primary-foreground" : "border-muted"}
                    `}>
                      {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                    </div>
                    <span className="hidden sm:inline font-medium text-sm">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-[2px] bg-muted mx-2 hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        {renderStep()}
      </div>
    </div>
  );
}
