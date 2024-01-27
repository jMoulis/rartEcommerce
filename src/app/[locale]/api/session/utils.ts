import { Frequency, WeekdayStr } from '@/src/app/components/dashboard/bookings/Session/types';
import { IOccurence } from '@/src/types/DBTypes';

export function generateOccurrences(dtstart?: string, interval: number = 1, until?: string, byweekday?: WeekdayStr[], freq: Frequency = Frequency.MONTHLY) {
  if (!dtstart || !until) {
    return []; // Return empty array if essential parameters are missing
  }

  const occurrences: Date[] = [];
  const currentDate = new Date(dtstart);
  const endDate = new Date(until);

  // Ensure valid dates
  if (isNaN(currentDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid start or end date');
  }
  const weekdaysMap = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

  const dayIndices = byweekday ? byweekday.map(day => weekdaysMap[day]) : [];

  while (currentDate.getTime() <= endDate.getTime()) {
    if (!byweekday || dayIndices.includes(currentDate.getDay())) {
      occurrences.push(new Date(currentDate.getTime())); // Clone the date
    }

    // Increment date based on frequency
    switch (freq) {
      case Frequency.YEARLY:
        currentDate.setFullYear(currentDate.getFullYear() + interval);
        break;
      case Frequency.MONTHLY:
        currentDate.setMonth(currentDate.getMonth() + interval);
        break;
      case Frequency.WEEKLY:
        currentDate.setDate(currentDate.getDate() + (7 * interval));
        break;
      case Frequency.DAILY:
        currentDate.setDate(currentDate.getDate() + interval);
        break;
      case Frequency.HOURLY:
        currentDate.setHours(currentDate.getHours() + interval);
        break;
      case Frequency.MINUTELY:
        currentDate.setMinutes(currentDate.getMinutes() + interval);
        break;
      case Frequency.SECONDLY:
        currentDate.setSeconds(currentDate.getSeconds() + interval);
        break;
    }
  }
  return occurrences;
}

export function formatDateInfo(date: Date): IOccurence {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return {
    dayString: dayNames[date.getDay()],
    dayNumber: date.getDate().toString().padStart(2, '0'),
    monthString: monthNames[date.getMonth()],
    yearString: date.getFullYear().toString(),
    time24: `${hours}:${minutes}`,
    jsDate: date,
    available: true,
    sessionId: ''
  };
}
