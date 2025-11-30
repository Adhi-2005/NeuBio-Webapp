import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionnaireResponseSchema, type InsertQuestionnaireResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: "q1_education",
    en: "What is the highest level of education completed by the mother and father?",
    ar: "ما هو أعلى مستوى تعليمي أكمله كلٌّ من الأم والأب؟",
    options: [
      { value: "primary", en: "Primary School", ar: "ابتدائية" },
      { value: "middle", en: "Middle School", ar: "متوسطة" },
      { value: "high_school", en: "High School", ar: "ثانوية" },
      { value: "bachelors", en: "Bachelor's Degree", ar: "بكالوريوس" },
      { value: "masters", en: "Master's Degree", ar: "ماجستير" },
      { value: "phd", en: "PhD", ar: "دكتوراه" },
      { value: "none", en: "None", ar: "لا يوجد" }
    ]
  },
  {
    id: "q2_work",
    en: "What kind of work do you do?",
    ar: "ما هو نوع العمل الذي تقومون به؟",
    options: [
      { value: "full_time", en: "Full-time", ar: "دوام كامل" },
      { value: "part_time", en: "Part-time", ar: "دوام جزئي" },
      { value: "self_employed", en: "Self-employed", ar: "عمل حر" },
      { value: "homemaker", en: "Homemaker", ar: "ربة منزل" },
      { value: "unemployed", en: "Unemployed", ar: "عاطل عن العمل" },
      { value: "student", en: "Student", ar: "طالب" }
    ]
  },
  {
    id: "q3_hobbies",
    en: "What are your hobbies or activities you enjoy in your free time?",
    ar: "ما هي هواياتكم أو الأنشطة التي تستمتعون بها في وقت الفراغ؟",
    options: [
      { value: "sports", en: "Sports", ar: "رياضة" },
      { value: "reading", en: "Reading", ar: "قراءة" },
      { value: "arts", en: "Arts & Crafts", ar: "فنون وحرف" },
      { value: "traveling", en: "Traveling", ar: "سفر" },
      { value: "socializing", en: "Socializing", ar: "اجتماعي" },
      { value: "other", en: "Other", ar: "أخرى" }
    ]
  },
  {
    id: "q4_siblings",
    en: "Do your other children attend school regularly? How are they performing?",
    ar: "هل يحضر إخوة الطفل المدرسة بانتظام؟ وكيف هو أداؤهم؟",
    options: [
      { value: "yes_well", en: "Yes, performing well", ar: "نعم، أداؤهم جيد" },
      { value: "yes_average", en: "Yes, average performance", ar: "نعم، أداؤهم متوسط" },
      { value: "yes_struggling", en: "Yes, struggling", ar: "نعم، يواجهون صعوبات" },
      { value: "no_siblings_school", en: "No siblings in school", ar: "لا يوجد إخوة في المدرسة" }
    ]
  },
  {
    id: "q5_importance",
    en: "Why do you believe hearing and communication are important for your child’s future?",
    ar: "لماذا تعتقدون أن السمع والتواصل مهمّان لمستقبل طفلكم؟",
    options: [
      { value: "development", en: "Essential for development", ar: "ضروري للتطور" },
      { value: "social", en: "Important for social life", ar: "مهم للحياة الاجتماعية" },
      { value: "education", en: "Important for education", ar: "مهم للتعليم" },
      { value: "all", en: "All of the above", ar: "كل ما سبق" }
    ]
  },
  {
    id: "q6_expectations",
    en: "How do you imagine your child’s life changing after receiving the cochlear implant?",
    ar: "كيف تتخيّلون حياة طفلكم بعد حصوله على زراعة القوقعة؟",
    options: [
      { value: "life_changing", en: "Life-changing improvement", ar: "تحسن جذري في الحياة" },
      { value: "moderate", en: "Moderate improvement", ar: "تحسن متوسط" },
      { value: "slight", en: "Slight improvement", ar: "تحسن طفيف" },
      { value: "unsure", en: "Unsure", ar: "غير متأكد" }
    ]
  },
  {
    id: "q7_commitment_medical",
    en: "Are you prepared to bring your child regularly for follow-ups?",
    ar: "هل أنتم مستعدّون لإحضار طفلكم بانتظام للمراجعات؟",
    options: [
      { value: "fully_prepared", en: "Yes, fully prepared", ar: "نعم، مستعد تماماً" },
      { value: "with_help", en: "Yes, with some help", ar: "نعم، بمساعدة البعض" },
      { value: "difficult", en: "No, might be difficult", ar: "لا، قد يكون صعباً" }
    ]
  },
  {
    id: "q8_education_support",
    en: "What is your approach to your child’s education?",
    ar: "ما هو أسلوبكم في دعم تعليم طفلكم؟",
    options: [
      { value: "personal", en: "Personal support at home", ar: "دعم شخصي في المنزل" },
      { value: "tutor", en: "Private tutor", ar: "مدرس خصوصي" },
      { value: "school_only", en: "Rely on school only", ar: "الاعتماد على المدرسة فقط" },
      { value: "unsure", en: "Not sure yet", ar: "غير متأكد بعد" }
    ]
  },
  {
    id: "q9_caregiver",
    en: "Who will be primarily responsible for the child's care?",
    ar: "من سيكون المسؤول الأساسي عن رعاية الطفل؟",
    options: [
      { value: "mother", en: "Mother", ar: "الأم" },
      { value: "father", en: "Father", ar: "الأب" },
      { value: "both", en: "Both Parents", ar: "كلا الوالدين" },
      { value: "grandparents", en: "Grandparents", ar: "الأجداد" },
      { value: "nanny", en: "Nanny", ar: "مربية" }
    ]
  },
  {
    id: "q10_challenges",
    en: "Have you faced any challenges in the past with attending medical appointments?",
    ar: "هل واجهتم أي صعوبات سابقًا في الالتزام بالمواعيد الطبية؟",
    options: [
      { value: "none", en: "No challenges", ar: "لا توجد تحديات" },
      { value: "financial", en: "Financial", ar: "مادية" },
      { value: "transportation", en: "Transportation", ar: "مواصلات" },
      { value: "time", en: "Time constraints", ar: "ضيق الوقت" },
      { value: "work", en: "Work commitments", ar: "التزامات العمل" }
    ]
  },
  {
    id: "q11_instruction_readiness",
    en: "Are you prepared to follow the instructions given by the doctor?",
    ar: "هل أنتم مستعدّون للالتزام بالإرشادات المقدّمة من الطبيب؟",
    options: [
      { value: "yes_absolutely", en: "Yes, absolutely", ar: "نعم، بالتأكيد" },
      { value: "yes_guidance", en: "Yes, but need guidance", ar: "نعم، ولكن أحتاج توجيه" },
      { value: "no", en: "No", ar: "لا" }
    ]
  },
  {
    id: "q12_commitment_level",
    en: "How committed are you to following these instructions?",
    ar: "ما مدى التزامكم باتباع هذه الإرشادات؟",
    options: [
      { value: "very_high", en: "Very High", ar: "عالي جداً" },
      { value: "high", en: "High", ar: "عالي" },
      { value: "moderate", en: "Moderate", ar: "متوسط" },
      { value: "low", en: "Low", ar: "منخفض" }
    ]
  }
];

export default function Questionnaire({ onNext }: { onNext?: () => void }) {
  const { toast } = useToast();
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<InsertQuestionnaireResponse>({
    resolver: zodResolver(insertQuestionnaireResponseSchema),
    defaultValues: {
      q1_education: "",
      q2_work: "",
      q3_hobbies: "",
      q4_siblings: "",
      q5_importance: "",
      q6_expectations: "",
      q7_commitment_medical: "",
      q8_education_support: "",
      q9_caregiver: "",
      q10_challenges: "",
      q11_instruction_readiness: "",
      q12_commitment_level: "",
    },
    mode: "onChange", // Enable validation on change
  });

  const handleNext = async () => {
    const currentQuestionId = questions[currentQuestionIndex].id as keyof InsertQuestionnaireResponse;
    const isValid = await form.trigger(currentQuestionId);
    
    if (isValid) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // It's the last question, submit the form
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const onSubmit = async (data: InsertQuestionnaireResponse) => {
    setIsSubmitting(true);
    try {
      console.log("Questionnaire Data:", data);
      toast({
        title: "Questionnaire Submitted",
        description: "Your responses have been recorded successfully.",
      });
      if (onNext) {
        onNext();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit questionnaire.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6 mt-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {questions.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 w-4 rounded-full transition-colors ${
                  idx <= currentQuestionIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="lang-toggle" className="text-xs font-bold uppercase">
              {lang === "en" ? "EN" : "AR"}
            </Label>
            <Switch
              id="lang-toggle"
              checked={lang === "ar"}
              onCheckedChange={(checked) => setLang(checked ? "ar" : "en")}
            />
          </div>
        </div>

        <div className="space-y-8">
          <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
            {lang === "en" ? currentQuestion.en.toUpperCase() : currentQuestion.ar}
          </h1>

          <Form {...form}>
            <form className="space-y-4">
              <FormField
                key={currentQuestion.id}
                control={form.control}
                name={currentQuestion.id as keyof InsertQuestionnaireResponse}
                render={({ field }) => (
                  <FormItem className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        className="flex flex-col space-y-3"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      >
                        {currentQuestion.options.map((option) => (
                          <FormItem key={option.value} className="space-y-0">
                            <FormControl>
                              <RadioGroupItem value={option.value} className="peer sr-only" />
                            </FormControl>
                            <FormLabel className="flex items-center justify-center w-full p-4 rounded-full bg-muted text-muted-foreground font-bold uppercase tracking-wide cursor-pointer transition-all peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted/80">
                              {lang === "en" ? option.en : option.ar}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="flex gap-4 mt-auto pt-8 pb-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full h-14 w-14 shrink-0 border-2"
          onClick={handlePrevious} 
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        
        <Button 
          className="flex-1 rounded-full h-14 text-lg font-bold uppercase tracking-wide"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {currentQuestionIndex === questions.length - 1 ? (
            <>
              {lang === "en" ? "Submit" : "إرسال"}
              {isSubmitting && "..."}
            </>
          ) : (
            <>
              {lang === "en" ? "Next" : "التالي"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
