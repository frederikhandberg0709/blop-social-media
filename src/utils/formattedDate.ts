import { format, parseISO, isValid } from "date-fns";

export function formatDate(dateString: string): string {
  const parsedDate = parseISO(dateString);

  if (!isValid(parsedDate)) {
    throw new Error(`Invalid date string: ${dateString}`);
  }

  const now = new Date();
  const differenceInSeconds = (now.getTime() - parsedDate.getTime()) / 1000;

  if (differenceInSeconds < 60) {
    return `${Math.floor(differenceInSeconds)}s`; // Seconds ago
  } else if (differenceInSeconds < 3600) {
    return `${Math.floor(differenceInSeconds / 60)}m`; // Minutes ago
  } else if (differenceInSeconds < 86400) {
    return `${Math.floor(differenceInSeconds / 3600)}h`; // Hours ago
  } else if (differenceInSeconds < 604800) {
    return `${Math.floor(differenceInSeconds / 86400)}d`; // Days ago
  } else {
    return format(parsedDate, "h:mm a · MMM d, yyyy"); // Absolute date
  }
}
