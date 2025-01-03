import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
 
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
 

export function getESTDateRange(date: { getFullYear: () => any; getMonth: () => any; getDate: () => any; }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  
  const start = new Date(year, month, day, 9, 30); // 9:30 AM
  const end = new Date(year, month, day, 16, 0);   // 4:00 PM

  // Convert to UTC
  start.setUTCHours(start.getUTCHours() - 5); // EST is UTC-5
  end.setUTCHours(end.getUTCHours() - 5);

  return { start, end };
}
