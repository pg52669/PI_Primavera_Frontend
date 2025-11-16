import { parse, format, isBefore, isAfter, isToday } from 'date-fns';
import { pt } from 'date-fns/locale';

/**
 * Parse API date format (dd-MM-yyyy) to Date object
 */
export const parseAPIDate = (dateString: string): Date => {
  return parse(dateString, 'dd-MM-yyyy', new Date());
};

/**
 * Format date to API format (dd-MM-yyyy)
 */
export const formatToAPIDate = (date: Date): string => {
  return format(date, 'dd-MM-yyyy');
};

/**
 * Format date for display in Portuguese
 * Example: "15 de novembro de 2025"
 */
export const formatDisplayDate = (dateString: string): string => {
  const date = parseAPIDate(dateString);
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt });
};

/**
 * Format date for short display
 * Example: "15 nov 2025"
 */
export const formatShortDate = (dateString: string): string => {
  const date = parseAPIDate(dateString);
  return format(date, 'dd MMM yyyy', { locale: pt });
};

/**
 * Get day of week in Portuguese
 * Example: "Segunda-feira"
 */
export const formatDayOfWeek = (dateString: string): string => {
  const date = parseAPIDate(dateString);
  return format(date, 'EEEE', { locale: pt });
};

/**
 * Check if event date is in the past
 */
export const isEventPast = (dateString: string): boolean => {
  const eventDate = parseAPIDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isBefore(eventDate, today);
};

/**
 * Check if event date is today
 */
export const isEventToday = (dateString: string): boolean => {
  const eventDate = parseAPIDate(dateString);
  return isToday(eventDate);
};

/**
 * Check if event date is upcoming (in the future)
 */
export const isEventUpcoming = (dateString: string): boolean => {
  const eventDate = parseAPIDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return isAfter(eventDate, today);
};

/**
 * Get relative date text in Portuguese
 * Example: "Hoje", "Amanhã", "Ontem", or formatted date
 */
export const getRelativeDateText = (dateString: string): string => {
  const eventDate = parseAPIDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (isToday(eventDate)) {
    return 'Hoje';
  } else if (eventDate.toDateString() === tomorrow.toDateString()) {
    return 'Amanhã';
  } else if (eventDate.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }
  
  return formatShortDate(dateString);
};
