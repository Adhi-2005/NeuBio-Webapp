import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const submittedCount = documents.filter(d => d.status === "submitted" || d.status === "approved").length;
  const progress = Math.round((submittedCount / documents.length) * 100);

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-500">Submitted</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "missing":
        return <Badge variant="destructive">Missing</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case "submitted":
        return <Clock className="w-5 h-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "missing":
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Document Upload Checklist</h1>
        <p className="text-muted-foreground mb-4">
          Please upload the required documents to support your application.
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Upload Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className={doc.status === "submitted" ? "bg-muted/20" : ""}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-shrink-0">
                {getStatusIcon(doc.status)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{doc.title}</h3>
                  {doc.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
                  {getStatusBadge(doc.status)}
                </div>
                <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                {doc.fileName && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-blue-600">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <Button 
                  variant={doc.status === "submitted" ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleUpload(doc.id)}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {doc.status === "submitted" ? "Re-upload" : "Upload"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button size="lg" disabled={progress < 100} onClick={onNext}>
          Submit Application
        </Button>
      </div>
    </div>
  );
}
