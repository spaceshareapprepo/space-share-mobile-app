import type {
  ListingType,
  SearchSegment,
  ShipmentRequest,
  SupabaseListingRow,
  TravellerListing
} from "../constants/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]):string => {
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
  airport: SupabaseListingRow["origin"]
): string {
  if (!airport) return "Unknown location";

  const city = airport.city ?? airport.name ?? "Unknown location";
  const code = airport.iata_code ?? "";

  return code ? `${city} (${code})` : city;
}

export function mapToTravellerListing(row: SupabaseListingRow): TravellerListing {
  const name =
    row.profile?.full_name?.trim() || row.title?.trim() || "Traveller";
  const departure =
    row.flight_date ?? row.created_at ?? new Date().toISOString();
  const capacity = row.max_weight_kg ?? 0;

  return {
    id: row.id,
    name,
    initials: getInitials(name),
    origin: formatAirport(row.origin),
    destination: formatAirport(row.destination),
    departureDate: departure,
    availableKg: capacity,
    totalCapacityKg: capacity,
    pricePerKgUsd: row.price_per_unit ?? 0,
    status: row.status_code === "1" ? "closingSoon" : "open",
    verification: row.is_verified ? ["ID verified"] : [],
    experience: row.profile ? "Trusted community member" : "New traveller",
    focus: row.description ?? "Ready to help move your items safely.",
  };
}

export function mapToShipmentRequest(row: SupabaseListingRow): ShipmentRequest {
  const ownerName = row.profile?.full_name?.trim() || "Anonymous sender";
  const readyBy =
    row.flight_date ?? row.created_at ?? new Date().toISOString();

  return {
    id: row.id,
    owner: ownerName,
    initials: getInitials(ownerName),
    itemName: row.title ?? "Shipment request",
    summary: row.description ?? "Details to be confirmed with the sender.",
    origin: formatAirport(row.origin),
    destination: formatAirport(row.destination),
    readyBy,
    weightKg: row.max_weight_kg ?? 0,
    budgetUsd: row.price_per_unit ?? 0,
    status: row.shipment_code === "urgent" ? "urgent" : "matching",
    handlingNotes:
      row.shipment_code === "urgent"
        ? "Sender marked this request as urgent. Please coordinate quickly."
        : "Coordinate handling details directly with the sender.",
  };
}