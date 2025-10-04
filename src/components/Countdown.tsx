import { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: Date;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownBoxProps {
  value: number | string;
  label: string;
}

function CountdownBox({ value, label }: CountdownBoxProps) {
  return (
    <div className="rounded-lg p-2 ">
      <div className="text-xl md:text-3xl font-bold text-black">{value}</div>
      <div className="text-xs md:text-sm text-gray-800">{label}</div>
    </div>
  );
}

export default function Countdown({ targetDate, className = '' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Calculate initial time left
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <p className="text-lg font-bold text-red-500">Time's up!</p>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        <CountdownBox value={timeLeft.days} label="Days" />
        <CountdownBox value={timeLeft.hours.toString().padStart(2, '0')} label="Hours" />
        <CountdownBox value={timeLeft.minutes.toString().padStart(2, '0')} label="Minutes" />
        <CountdownBox value={timeLeft.seconds.toString().padStart(2, '0')} label="Seconds" />
      </div>
    </div>
  );
}
