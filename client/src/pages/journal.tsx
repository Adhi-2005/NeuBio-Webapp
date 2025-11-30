import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { HearingAgeCounter } from "@/components/hearing-age-counter";
import { MilestoneCalendar } from "@/components/milestone-calendar";
import { AppointmentModal } from "@/components/appointment-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ExternalLink, Lightbulb, Shield, Droplets, Volume2, Sun, Users } from "lucide-react";
import type { Appointment, InsertAppointment, OnboardingData } from "@shared/schema";
import { useAuth } from "@/lib/auth-context";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const surveys = [
  {
    id: 1,
    title: "Month 1 Feedback",
    description: "Share your initial experience with your hearing device",
    icon: Users,
    color: "text-chart-1",
  },
  {
    id: 2,
    title: "Device Comfort Survey",
    description: "Help us understand your comfort level with the device",
    icon: Shield,
    color: "text-chart-2",
  },
  {
    id: 3,
    title: "Sound Quality Assessment",
    description: "Evaluate the quality of sound in different environments",
    icon: Volume2,
    color: "text-chart-3",
  },
  {
    id: 4,
    title: "Daily Usage Patterns",
    description: "Track how you use your device throughout the day",
    icon: Sun,
    color: "text-chart-4",
  },
];

const tips = [
  {
    title: "Clean Your Processor Daily",
    description: "Use a soft, dry cloth to gently clean the external processor. Avoid moisture and harsh chemicals.",
    icon: Droplets,
  },
  {
    title: "Gradual Sound Exposure",
    description: "Start in quiet environments and gradually increase exposure to more complex sound situations.",
    icon: Volume2,
  },
  {
    title: "Practice Listening",
    description: "Engage in daily listening exercises to help your brain adapt to new sound patterns.",
    icon: Lightbulb,
  },
  {
    title: "Stay Connected",
    description: "Join support groups and connect with others on similar hearing journeys for encouragement.",
    icon: Users,
  },
];

export default function Journal() {
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: onboardingData, isLoading: onboardingLoading } = useQuery<{ onboarding: OnboardingData }>({
    queryKey: ["/api/onboarding", user?.id],
    enabled: !!user,
  });

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery<{ appointments: Appointment[] }>({
    queryKey: ["/api/appointments", user?.id],
    enabled: !!user,
  });

  const createAppointmentMutation = useMutation({
    mutationFn: async (data: InsertAppointment & { audiogram?: File }) => {
      if (!user) throw new Error("User not authenticated");

      const formData = new FormData();
      formData.append("userId", user.id);
      formData.append("appointmentDate", data.appointmentDate);
      formData.append("doctorName", data.doctorName);
      if (data.notes) formData.append("notes", data.notes);
      if (data.audiogram) formData.append("audiogram", data.audiogram);

      const response = await fetch("/api/appointments", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create appointment");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments", user?.id] });
      toast({
        title: "Appointment saved",
        description: "Your appointment has been registered successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAppointmentSubmit = async (data: InsertAppointment & { audiogram?: File }) => {
    await createAppointmentMutation.mutateAsync(data);
  };

  if (onboardingLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          <div className="flex flex-col items-center py-12">
            <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-full" />
            <Skeleton className="h-8 w-64 mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!onboardingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-black uppercase tracking-tight">Complete Your Onboarding</CardTitle>
            <CardDescription>
              Please complete the onboarding process to access your journal.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const appointments = appointmentsData?.appointments || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <HearingAgeCounter activationDate={onboardingData.onboarding.activationDate} />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black uppercase tracking-tight">Your Milestones</h2>
            <Button onClick={() => setAppointmentModalOpen(true)} data-testid="button-register-appointment" className="rounded-full font-bold uppercase tracking-wide">
              <Plus className="w-4 h-4 mr-2" />
              Register Appointment
            </Button>
          </div>

          {appointmentsLoading ? (
            <Skeleton className="h-96 w-full rounded-3xl" />
          ) : (
            <MilestoneCalendar
              surgeryDate={onboardingData.onboarding.surgeryDate || undefined}
              activationDate={onboardingData.onboarding.activationDate}
              appointments={appointments}
            />
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">Surveys & Feedback</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {surveys.map((survey) => (
              <Card key={survey.id} className="hover-elevate cursor-pointer transition-all rounded-3xl border-2 hover:border-primary/20" data-testid={`card-survey-${survey.id}`}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <survey.icon className={`w-6 h-6 ${survey.color}`} />
                  </div>
                  <CardTitle className="text-lg font-bold uppercase tracking-wide">{survey.title}</CardTitle>
                  <CardDescription>{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between rounded-full font-bold uppercase tracking-wide" data-testid={`button-survey-${survey.id}`}>
                    Start Survey
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black uppercase tracking-tight">Daily Tips & Care</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <Card key={index} data-testid={`card-tip-${index}`} className="rounded-3xl border-2">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                      <tip.icon className="w-6 h-6 text-chart-2" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold uppercase tracking-wide">{tip.title}</CardTitle>
                      <CardDescription className="mt-2 leading-relaxed">
                        {tip.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <AppointmentModal
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        onSubmit={handleAppointmentSubmit}
      />
    </div>
  );
}
