import { differenceInDays, parse } from "date-fns";
import { Activity } from "lucide-react";

interface HearingAgeCounterProps {
  activationDate: string;
}

export function HearingAgeCounter({ activationDate }: HearingAgeCounterProps) {
  const activation = parse(activationDate, "yyyy-MM-dd", new Date());
  const daysSinceActivation = differenceInDays(new Date(), activation);

  const circumference = 2 * Math.PI * 90;
  const progress = Math.min(daysSinceActivation / 365, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center py-12 px-4">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="90"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="90"
            stroke="hsl(var(--primary))"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Activity className="w-8 h-8 text-primary mb-2" />
          <div className="text-5xl md:text-6xl font-bold text-foreground" data-testid="text-hearing-days">
            {daysSinceActivation}
          </div>
          <div className="text-lg md:text-xl font-medium text-muted-foreground mt-2 text-center px-4">
            {daysSinceActivation === 1 ? "Day" : "Days"}
          </div>
        </div>
      </div>
      <p className="text-xl md:text-2xl font-medium text-center mt-6 text-foreground">
        of your Hearing Journey
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {progress >= 1 ? "Over a year of progress!" : `${Math.round(progress * 100)}% through your first year`}
      </p>
    </div>
  );
}
