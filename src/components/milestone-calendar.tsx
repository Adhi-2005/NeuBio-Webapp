import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Activity, Stethoscope } from "lucide-react";
import { parse, format, isSameDay } from "date-fns";
import type { Appointment } from "@shared/schema";

interface MilestoneCalendarProps {
  surgeryDate?: string;
  activationDate: string;
  appointments: Appointment[];
}

export function MilestoneCalendar({ surgeryDate, activationDate, appointments }: MilestoneCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const surgery = surgeryDate ? parse(surgeryDate, "yyyy-MM-dd", new Date()) : null;
  const activation = parse(activationDate, "yyyy-MM-dd", new Date());
  const appointmentDates = appointments.map(apt => parse(apt.appointmentDate, "yyyy-MM-dd", new Date()));

  const modifiers = {
    surgery: surgery ? [surgery] : [],
    activation: [activation],
    appointment: appointmentDates,
  };

  const modifiersClassNames = {
    surgery: "bg-destructive/20 text-destructive font-semibold",
    activation: "bg-primary/20 text-primary font-semibold",
    appointment: "bg-accent text-accent-foreground font-semibold",
  };

  return (
    <Card className="rounded-3xl border-2">
      <CardHeader>
        <CardTitle className="text-2xl font-black uppercase tracking-tight">Milestone Calendar</CardTitle>
        <CardDescription>
          Track important dates in your hearing journey
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="rounded-3xl border-2 p-4"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {surgery && (
            <div className="flex items-center gap-2 p-3 rounded-full bg-destructive/5 border border-destructive/20">
              <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-4 h-4 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wide text-foreground">Surgery</p>
                <p className="text-xs text-muted-foreground truncate">
                  {format(surgery, "MMM d, yyyy")}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 p-3 rounded-full bg-primary/5 border border-primary/20">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-foreground">Activation</p>
              <p className="text-xs text-muted-foreground truncate">
                {format(activation, "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-full bg-accent/50 border border-accent-foreground/20">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="w-4 h-4 text-accent-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-wide text-foreground">Appointments</p>
              <p className="text-xs text-muted-foreground">
                {appointments.length} scheduled
              </p>
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="p-6 rounded-3xl bg-muted/30 border-2 border-muted">
            <p className="text-lg font-bold uppercase tracking-wide mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </p>
            {surgery && isSameDay(selectedDate, surgery) && (
              <Badge variant="destructive" className="mr-2 rounded-full px-3">Surgery Date</Badge>
            )}
            {isSameDay(selectedDate, activation) && (
              <Badge className="mr-2 rounded-full px-3">Activation Date</Badge>
            )}
            {appointmentDates.some(date => isSameDay(selectedDate, date)) && (
              <div className="mt-2 space-y-2">
                {appointments
                  .filter(apt => isSameDay(parse(apt.appointmentDate, "yyyy-MM-dd", new Date()), selectedDate))
                  .map(apt => (
                    <div key={apt.id} className="text-sm p-3 bg-background rounded-2xl border">
                      <p className="font-bold uppercase tracking-wide">{apt.doctorName}</p>
                      {apt.notes && <p className="text-muted-foreground mt-1">{apt.notes}</p>}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
