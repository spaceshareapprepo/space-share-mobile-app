import { clsx, type ClassValue } from "clsx";
import Constants from "expo-constants";
import { twMerge } from "tailwind-merge";
import type {
  ListingRow,
  ListingType,
  SearchSegment
} from "../constants/types";

export const cn = (...inputs: ClassValue[]):string => {
  return twMerge(clsx(inputs))
}

export const generateAPIUrl = (relativePath: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const origin =
      Constants?.experienceUrl?.replace("exp://", "http://") || API_URL;

    const path = relativePath.startsWith("/")
      ? relativePath
      : `/${relativePath}`;

    if (process.env.NODE_ENV === "development") {
      return origin?.concat(path);
    }

    if (!API_URL) {
      throw new Error("API_URL environment variable is not defined");
    }

    return API_URL.concat(path);
  };

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
  return new Date(value).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(value: string) {
  const parts = value
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return '??';

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

export function normaliseSegment(raw: string | null): SearchSegment {
  if (raw === "routes" || raw === "items") {
    return raw;
  }
  return "all";
}

export function segmentToListingType(segment: SearchSegment): ListingType | null {
  if (segment === "routes") return "travel";
  if (segment === "items") return "shipment";
  return null;
}

export function normaliseSearchTerm(raw: string | null) {
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function formatAirport(
  airport: ListingRow["origin"]
): string {
  if (!airport) return "Unknown location";

  const city = airport.city ?? airport.name ?? "Unknown location";
  const code = airport.iata_code ?? "";

  return code ? `${city} (${code})` : city;
}