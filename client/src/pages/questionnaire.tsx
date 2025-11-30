import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionnaireResponseSchema, type InsertQuestionnaireResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const questions = [
  {
    id: "q1_education",
    en: "1. What is the highest level of education completed by the mother and father?",
    ar: "١. ما هو أعلى مستوى تعليمي أكمله كلٌّ من الأم والأب؟",
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
    en: "2. What kind of work do you do?",
    ar: "٢. ما هو نوع العمل الذي تقومون به؟",
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
    en: "3. What are your hobbies or activities you enjoy in your free time?",
    ar: "٣. ما هي هواياتكم أو الأنشطة التي تستمتعون بها في وقت الفراغ؟",
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
    en: "4. Do your other children attend school regularly? How are they performing?",
    ar: "٤. هل يحضر إخوة الطفل المدرسة بانتظام؟ وكيف هو أداؤهم؟",
    options: [
      { value: "yes_well", en: "Yes, performing well", ar: "نعم، أداؤهم جيد" },
      { value: "yes_average", en: "Yes, average performance", ar: "نعم، أداؤهم متوسط" },
      { value: "yes_struggling", en: "Yes, struggling", ar: "نعم، يواجهون صعوبات" },
      { value: "no_siblings_school", en: "No siblings in school", ar: "لا يوجد إخوة في المدرسة" }
    ]
  },
  {
    id: "q5_importance",
    en: "5. Why do you believe hearing and communication are important for your child’s future?",
    ar: "٥. لماذا تعتقدون أن السمع والتواصل مهمّان لمستقبل طفلكم؟",
    options: [
      { value: "development", en: "Essential for development", ar: "ضروري للتطور" },
      { value: "social", en: "Important for social life", ar: "مهم للحياة الاجتماعية" },
      { value: "education", en: "Important for education", ar: "مهم للتعليم" },
      { value: "all", en: "All of the above", ar: "كل ما سبق" }
    ]
  },
  {
    id: "q6_expectations",
    en: "6. How do you imagine your child’s life changing after receiving the cochlear implant?",
    ar: "٦. كيف تتخيّلون حياة طفلكم بعد حصوله على زراعة القوقعة؟",
    options: [
      { value: "life_changing", en: "Life-changing improvement", ar: "تحسن جذري في الحياة" },
      { value: "moderate", en: "Moderate improvement", ar: "تحسن متوسط" },
      { value: "slight", en: "Slight improvement", ar: "تحسن طفيف" },
      { value: "unsure", en: "Unsure", ar: "غير متأكد" }
    ]
  },
  {
    id: "q7_commitment_medical",
    en: "7. Are you prepared to bring your child regularly for follow-ups?",
    ar: "٧. هل أنتم مستعدّون لإحضار طفلكم بانتظام للمراجعات؟",
    options: [
      { value: "fully_prepared", en: "Yes, fully prepared", ar: "نعم، مستعد تماماً" },
      { value: "with_help", en: "Yes, with some help", ar: "نعم، بمساعدة البعض" },
      { value: "difficult", en: "No, might be difficult", ar: "لا، قد يكون صعباً" }
    ]
  },
  {
    id: "q8_education_support",
    en: "8. What is your approach to your child’s education?",
    ar: "٨. ما هو أسلوبكم في دعم تعليم طفلكم؟",
    options: [
      { value: "personal", en: "Personal support at home", ar: "دعم شخصي في المنزل" },
      { value: "tutor", en: "Private tutor", ar: "مدرس خصوصي" },
      { value: "school_only", en: "Rely on school only", ar: "الاعتماد على المدرسة فقط" },
      { value: "unsure", en: "Not sure yet", ar: "غير متأكد بعد" }
    ]
  },
  {
    id: "q9_caregiver",
    en: "9. Who will be primarily responsible for the child's care?",
    ar: "٩. من سيكون المسؤول الأساسي عن رعاية الطفل؟",
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
    en: "10. Have you faced any challenges in the past with attending medical appointments?",
    ar: "١٠. هل واجهتم أي صعوبات سابقًا في الالتزام بالمواعيد الطبية؟",
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
    en: "11. Are you prepared to follow the instructions given by the doctor?",
    ar: "١١. هل أنتم مستعدّون للالتزام بالإرشادات المقدّمة من الطبيب؟",
    options: [
      { value: "yes_absolutely", en: "Yes, absolutely", ar: "نعم، بالتأكيد" },
      { value: "yes_guidance", en: "Yes, but need guidance", ar: "نعم، ولكن أحتاج توجيه" },
      { value: "no", en: "No", ar: "لا" }
    ]
  },
  {
    id: "q12_commitment_level",
    en: "12. How committed are you to following these instructions?",
    ar: "١٢. ما مدى التزامكم باتباع هذه الإرشادات؟",
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

  // Calculate progress based on filled fields
  const watchedValues = form.watch();
  const filledCount = Object.values(watchedValues).filter(v => v && v.toString().trim() !== "").length;
  const progress = Math.round((filledCount / questions.length) * 100);

  const onSaveDraft = async () => {
    const data = form.getValues();
    console.log("Draft Data:", data);
    toast({
      title: "Draft Saved",
      description: "Your answers have been saved. You can continue later.",
    });
  };

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
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parent Readiness Questionnaire</h1>
        <div className="flex items-center space-x-2">
          <Label htmlFor="lang-toggle" className="font-medium">
            {lang === "en" ? "English" : "العربية"}
          </Label>
          <Switch
            id="lang-toggle"
            checked={lang === "ar"}
            onCheckedChange={(checked) => setLang(checked ? "ar" : "en")}
          />
        </div>
      </div>

      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{progress}% Completed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle>{lang === "en" ? "Questionnaire" : "الاستبيان"}</CardTitle>
          <CardDescription>
            {lang === "en" 
              ? "Please answer the following questions to help us understand your background and readiness."
              : "يرجى الإجابة على الأسئلة التالية لمساعدتنا في فهم خلفيتكم واستعدادكم."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <Form {...form}>
            <form className="space-y-8">
              <FormField
                key={currentQuestion.id}
                control={form.control}
                name={currentQuestion.id as keyof InsertQuestionnaireResponse}
                render={({ field }) => (
                  <FormItem className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <FormLabel className="text-lg font-medium leading-relaxed block">
                      <span className="block mb-2 text-primary">{lang === "en" ? currentQuestion.en : currentQuestion.ar}</span>
                      {lang !== "en" && <span className="block text-sm text-muted-foreground">{currentQuestion.en}</span>}
                      {lang === "en" && <span className="block text-sm text-muted-foreground text-right" dir="rtl">{currentQuestion.ar}</span>}
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value?.toString()}
                        className="flex flex-col space-y-3 mt-4"
                        dir={lang === "ar" ? "rtl" : "ltr"}
                      >
                        {currentQuestion.options.map((option) => (
                          <FormItem key={option.value} className="flex items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value={option.value} />
                            </FormControl>
                            <FormLabel className="font-normal flex-grow cursor-pointer">
                              <span className="block text-base">{lang === "en" ? option.en : option.ar}</span>
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
        </CardContent>
        <CardFooter className="flex flex-col-reverse sm:flex-row justify-between gap-4 border-t pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === "en" ? "Previous" : "السابق"}
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button type="button" variant="ghost" onClick={onSaveDraft} className="w-full sm:w-auto order-2 sm:order-1">
              <Save className="w-4 h-4 mr-2" />
              {lang === "en" ? "Save Draft" : "حفظ المسودة"}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                <>
                  {lang === "en" ? "Submit" : "إرسال"}
                  {isSubmitting && "..."}
                </>
              ) : (
                <>
                  {lang === "en" ? "Next" : "التالي"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
