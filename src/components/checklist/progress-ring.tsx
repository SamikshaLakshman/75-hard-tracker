"use client";

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}

export default function ProgressRing({ percentage, size = 200, strokeWidth = 8 }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
          stroke="var(--surface-container-highest, #333)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent"
          stroke="#C3F400" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-700 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-display-stat text-foreground">{Math.round(percentage)}%</span>
        <span className="text-label-caps text-muted-foreground">DAILY GOAL</span>
      </div>
    </div>
  );
}
