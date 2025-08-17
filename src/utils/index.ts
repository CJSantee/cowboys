import { format, isThisWeek, isThisYear, isToday } from 'date-fns';

/**
 * Parses a date string in the format "YYYY-MM-DD" and returns a formatted date string.
 * @param dateString The date string to parse.
 * @returns The formatted date string.
 */
export function parseDate(dateString: string) {
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day);
  if (isToday(localDate)) {
    return 'Today';
  } else if (isThisWeek(localDate)) {
    return format(localDate, 'EEEE');
  } else if (isThisYear(localDate)) {
    return format(localDate, 'MMM do');
  } else {
    return format(localDate, 'MMM do, yyyy');
  }
}

export function convertDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}
