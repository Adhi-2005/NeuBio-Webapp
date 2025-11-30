import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";

type DocumentStatus = "pending" | "submitted" | "approved" | "missing";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
}

const initialDocuments: DocumentItem[] = [
  {
    id: "app_form",
    title: "Completed Application Form",
    description: "PDF/JPG - Download template if needed",
    required: true,
    status: "pending"
  },
  {
    id: "passport",
    title: "Passport & Residence Copy",
    description: "Front + visa page",
    required: true,
    status: "pending"
  },
  {
    id: "emirates_id",
    title: "Emirates ID Copy",
    description: "Front & back (Valid)",
    required: true,
    status: "pending"
  },
  {
    id: "medical_report",
    title: "Medical Report",
    description: "Hospital/ENT report (≤6 months)",
    required: true,
    status: "pending"
  },
  {
    id: "insurance_card",
    title: "Insurance Card Copy",
    description: "If available",
    required: false,
    status: "pending"
  },
  {
    id: "no_insurance",
    title: "Proof of No Insurance Coverage",
    description: "Optional if not insured",
    required: false,
    status: "pending"
  },
  {
    id: "salary_cert",
    title: "Salary Certificate",
    description: "Employer stamped",
    required: true,
    status: "pending"
  },
  {
    id: "bank_statement",
    title: "Bank Statement",
    description: "6 months history",
    required: true,
    status: "pending"
  },
  {
    id: "tenancy_contract",
    title: "Tenancy Contract",
    description: "EJARI / standard lease",
    required: true,
    status: "pending"
  }
];

export default function Documents({ onNext }: { onNext?: () => void }) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleUpload = (id: string) => {
    // Simulate file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulate upload process
        setDocuments(prev => prev.map(doc => 
          doc.id === id 
            ? { ...doc, status: "submitted", fileName: file.name } 
            : doc
        ));
        
        toast({
          title: "File Uploaded",
          description: `${file.name} has been uploaded successfully.`,
        });
      }
    };
    
    input.click();
  };

  const handleNext = () => {
    if (currentIndex < documents.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentDoc = documents[currentIndex];
  const progress = Math.round(((currentIndex + 1) / documents.length) * 100);
  const isCurrentDocUploaded = currentDoc.status === "submitted" || currentDoc.status === "approved";
  const canProceed = !currentDoc.required || isCurrentDocUploaded;

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-primary text-primary-foreground rounded-full px-3">Submitted</Badge>;
      case "approved":
        return <Badge className="bg-chart-2 text-white rounded-full px-3">Approved</Badge>;
      case "missing":
        return <Badge variant="destructive" className="rounded-full px-3">Missing</Badge>;
      default:
        return <Badge variant="outline" className="rounded-full px-3">Pending</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {documents.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 w-4 rounded-full transition-colors ${
                  idx <= currentIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-bold uppercase text-muted-foreground">
            {currentIndex + 1} / {documents.length}
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
            Upload<br />Documents
          </h1>
          <p className="text-muted-foreground font-medium">
            Please upload the required document below.
          </p>
        </div>

        <div className="mt-8 animate-in fade-in slide-in-from-right-4 duration-300">
          <Card className="border-2 rounded-3xl overflow-hidden">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                isCurrentDocUploaded ? "bg-chart-2/20 text-chart-2" : "bg-muted text-muted-foreground"
              }`}>
                {isCurrentDocUploaded ? (
                  <CheckCircle className="w-10 h-10" />
                ) : (
                  <FileText className="w-10 h-10" />
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <h3 className="text-xl font-bold uppercase tracking-wide">{currentDoc.title}</h3>
                </div>
                {currentDoc.required && (
                  <Badge variant="secondary" className="rounded-full px-3">Required</Badge>
                )}
                <p className="text-muted-foreground">{currentDoc.description}</p>
              </div>

              {currentDoc.fileName && (
                <div className="flex items-center gap-2 text-sm text-primary font-medium bg-primary/10 px-4 py-2 rounded-full">
                  <FileText className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{currentDoc.fileName}</span>
                </div>
              )}

              <Button 
                variant={isCurrentDocUploaded ? "outline" : "default"}
                size="lg"
                className="w-full rounded-full h-14 text-lg font-bold uppercase tracking-wide"
                onClick={() => handleUpload(currentDoc.id)}
              >
                <Upload className="w-5 h-5 mr-2" />
                {isCurrentDocUploaded ? "Replace File" : "Upload File"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-4 mt-auto pt-8 pb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 shrink-0 border-2"
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <Button 
          className="flex-1 rounded-full h-14 text-lg font-bold uppercase tracking-wide"
          onClick={handleNext}
          disabled={!canProceed}
        >
          {currentIndex === documents.length - 1 ? "Review" : "Next"}
          {currentIndex !== documents.length - 1 && <ArrowRight className="w-5 h-5 ml-2" />}
        </Button>
      </div>
    </div>
  );
}
