import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Dot, Info, FileText, HelpCircle, Upload, ArrowLeft, ArrowRight } from "lucide-react";
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

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-8 text-center mt-8">
              <h1 className="text-4xl font-black uppercase tracking-tight">
                We Make Your<br />Life Easier
              </h1>
              
              <div className="flex justify-center -space-x-4 py-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-16 h-16 rounded-full border-4 border-background bg-muted overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${i + 10}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4 max-w-xs mx-auto">
                <p className="text-muted-foreground font-medium">
                  Join thousands of families who have successfully navigated their hearing journey with us.
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-8">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-14 w-14 shrink-0 border-2"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Button 
                className="flex-1 rounded-full h-14 text-lg font-bold uppercase tracking-wide"
                onClick={handleNext}
              >
                Next
              </Button>
            </div>
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
          <div className="flex flex-col h-full justify-between">
            <div className="space-y-8 text-center mt-8">
              <h1 className="text-4xl font-black uppercase tracking-tight">
                Ready to<br />Submit?
              </h1>
              
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-full bg-muted/50 border-2 border-transparent hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg uppercase tracking-wide">Beneficiary Profile</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-full bg-muted/50 border-2 border-transparent hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg uppercase tracking-wide">Questionnaire</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-full bg-muted/50 border-2 border-transparent hover:border-primary/20 transition-all">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-lg uppercase tracking-wide">Documents</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-auto pt-8">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full h-14 w-14 shrink-0 border-2"
                onClick={handleBack}
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Button 
                className="flex-1 rounded-full h-14 text-lg font-bold uppercase tracking-wide"
                onClick={handleNext}
              >
                Submit Application
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto p-6">
      {/* Segmented Progress Bar */}
      <div className="flex gap-2 mb-8">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              currentStep >= step.id ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end mb-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => setLocation("/status")}>
            Skip onboarding
          </Button>
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
}
