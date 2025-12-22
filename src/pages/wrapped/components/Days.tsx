import { useMemo, useState } from 'react';

export interface DayData {
  week: string;
  score_date: string;
  num_cowboys: number;
}

interface DaysProps {
  days?: DayData[];
}

export default function Days({ days = [] }: DaysProps) {
  const [selectedDay, setSelectedDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const { gridData, uniqueDaysCount } = useMemo(() => {
    if (!days || days.length === 0) return { gridData: [], uniqueDaysCount: 0 };

    // Create a map for quick lookup
    const dataMap = new Map<string, number>();
    days.forEach(d => {
      dataMap.set(d.score_date, (dataMap.get(d.score_date) || 0) + d.num_cowboys);
    });

    let countGreaterThanOne = 0;
    for (const count of dataMap.values()) {
      if (count > 1) {
        countGreaterThanOne++;
      }
    }

    // Find min and max dates
    const sortedDates = days
      .map(d => d.score_date)
      .sort((a, b) => a.localeCompare(b));

    if (sortedDates.length === 0) return { gridData: [], uniqueDaysCount: 0 };

    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    // Adjust start date to previous Sunday
    const startDay = startDate.getDay(); // 0 is Sunday
    const gridStart = new Date(startDate);
    gridStart.setDate(startDate.getDate() - startDay);

    // Adjust end date to next Saturday usually, or just let it flow?
    // User asked for 7 columns. If we just list days continuously, CSS grid-cols-7 
    // will naturally wrap them into weeks if we start on a Sunday.
    // Let's just go until the last date provided, or maybe pad to end of week for neatness.
    // Padding to end of week looks better.
    const endDay = endDate.getDay();
    const gridEnd = new Date(endDate);
    gridEnd.setDate(endDate.getDate() + (6 - endDay));

    const allDays = [];
    const current = new Date(gridStart);

    while (current <= gridEnd) {
      // Format as YYYY-MM-DD to match incoming data format roughly 
      // (assuming score_date is YYYY-MM-DD based on previous code usage)
      // Actually we need to be careful with timezone/local conversions.
      // The simplest way to generate YYYY-MM-DD string locally:
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const count = dataMap.get(dateStr) || 0;

      allDays.push({
        date: dateStr,
        count,
        obj: current.toDateString() // just for key/debug
      });

      current.setDate(current.getDate() + 1);
    }

    return { gridData: allDays, uniqueDaysCount: countGreaterThanOne };
  }, [days]);

  const getColor = (count: number) => {
    if (count === 0) return '#fff7ed'; // Orange-50
    if (count === 1) return '#ffedd5'; // Orange-100
    if (count === 2) return '#fdba74'; // Orange-300
    if (count === 3) return '#f97316'; // Orange-500
    if (count === 4) return '#c2410c'; // Orange-700
    return '#7c2d12'; // Orange-900 (5+)
  };

  const handleDayClick = (e: React.MouseEvent<HTMLDivElement>, day: { date: string, count: number }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectedDay({
      date: day.date,
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full px-2 h-full overflow-hidden relative">
      <div className="w-full py-2 text-center shrink-0">
        <h2 className="text-3xl font-bold mb-2">The cowboys took photos on</h2>
        <span className="text-6xl font-black leading-none text-[#E42A1D]">
          {uniqueDaysCount}
        </span>
        <h2 className="text-3xl font-bold mt-2">unique days.</h2>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 w-full flex justify-center">
        <div className="w-full max-w-md">
          {/* Legend or Day headers? Optional, but helpful for "7 columns" context */}
          <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs text-gray-400 font-medium">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>

          <div className="grid grid-cols-7 gap-1 auto-rows-fr">
            {gridData.map((day) => (
              <div
                key={day.date}
                onClick={(e) => handleDayClick(e, day)}
                className="aspect-square rounded-sm w-full border border-black/5 cursor-pointer hover:opacity-80 transition-opacity"
                style={{ backgroundColor: getColor(day.count) }}
                title={`${day.date}: ${day.count} cowboys`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-2 pb-4 text-xs text-gray-500 font-medium mt-2">
        <span>0</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="w-3 h-3 rounded-sm border border-black/5"
              style={{ backgroundColor: getColor(level) }}
              title={level === 5 ? '5+ cowboys' : `${level} cowboys`}
            />
          ))}
        </div>
        <span>5</span>
      </div>

      {/* Tooltip Overlay */}
      {selectedDay && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setSelectedDay(null)} />
          <div
            className="fixed z-50 px-3 py-2 text-xs text-white bg-black/90 rounded shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full mb-2"
            style={{ left: selectedDay.x, top: selectedDay.y - 4 }}
          >
            <div className="font-bold text-nowrap">{selectedDay.date}</div>
            <div className="text-nowrap">{selectedDay.count === 1 ? '1 cowboy' : `${selectedDay.count} cowboys`}</div>
            {/* Tiny arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-black/90" />
          </div>
        </>
      )}
    </div>
  );
}