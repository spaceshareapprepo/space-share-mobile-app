import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatRelative(value: string) {
  const target = new Date(value).getTime();
  const diff = target - Date.now();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  if (days < -1) {
    return `${Math.abs(days)} days ago`;
  }
  if (days === -1) {
    return 'Yesterday';
  }
  if (days === 0) {
    return 'Today';
  }
  if (days === 1) {
    return 'In 1 day';
  }
  return `In ${days} days`;
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(value: string) {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) {
    return '??';
  }

  if (parts.length === 1) {
    const [first] = parts;
    if (!first) {
      return '??';
    }
    const firstChar = first.charAt(0);
    const secondChar = first.charAt(1) || firstChar;
    return `${firstChar}${secondChar}`.toUpperCase();
  }

  const firstInitial = parts[0].charAt(0);
  const secondInitial = parts[1].charAt(0) || parts[0].charAt(1) || firstInitial;
  const initials = `${firstInitial}${secondInitial}`.toUpperCase();

  return initials || '??';
}