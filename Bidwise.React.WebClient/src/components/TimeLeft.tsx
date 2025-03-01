import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const secondsIn6Hours = 6 * 3600;
// Dayjs parses and displays in local time by default...

export const TimeLeft = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diffSeconds = dayjs(endDate).diff(dayjs(), "second");

    if (diffSeconds <= 0) return "Ended";

    if (diffSeconds < secondsIn6Hours) {
      const d = dayjs.duration(diffSeconds, "seconds");
      return `${String(d.hours()).padStart(1, "0")}:${String(
        d.minutes()
      ).padStart(2, "0")}:${String(d.seconds()).padStart(2, "0")}`;
    }

    if (diffSeconds < 24 * 3600)
      return `${Math.floor(diffSeconds / 3600)} Hours`;

    const dayLeft = Math.floor(diffSeconds / (24 * 3600));
    if (dayLeft === 1) return "1 Day";

    return `${dayLeft} Days`;
  }

  useEffect(() => {
    if (dayjs(endDate).diff(dayjs(), "second") < 6 * 3600) {
      const interval = setInterval(() => {
        setTimeLeft(getTimeLeft());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [endDate]);

  return <span>{timeLeft}</span>;
};
