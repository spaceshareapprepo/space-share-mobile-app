import { Json, Database, Tables, Enums } from "@/lib/database/supabase.types"

export type SegmentKey = 'routes' | 'items';

export type QuickFilter = {
  label: string;
  value: string;
  segment: SegmentKey;
};

export type Listing = {
  id: string;
  owner: string;
  initials: string;
  title: string;
  origin: string;
  destination: string;
  departureDate: string;
  availableKg: number;
  availableLb: number;
  pricePerUnit: number;
  currencyCode: string;
  status: string;
  isVerified: string[];
  description: string;
  experience: string;
  focus: string;
  
};


export type TravellerListing = {
  id: string;
  ownerName: string;
  initials: string;
  origin: string;
  destination: string;
  departureDate: string;
  maxWeightKg: number;
  pricePerUnit: number;
  isVerified: boolean;
  title: string;
  experience: string;
  description: string;
  photos: Json;
  type: string; 
};

export type ShipmentRequest = {
  id: string;
  ownerName: string;
  initials: string;
  origin: string;
  destination: string;
  maxWeightKg: number;
  departureDate: string;
  pricePerUnit: number;
  isVerified: boolean;
  title: string;
  experience: string;
  description: string;
  photos: Json;
  shipmentCode: 'matching' | 'urgent';
  handlingNotes: string;
  type: string;
};

export type RelatedAirport = {
  id: string;
  city: string | null;
  name: string | null;
  iata_code: string | null;
};

export type SearchSegment = "routes" | "items" | "all";
export type ListingType = "travel" | "shipment";

export type SupabaseListingRow = {
  id: string;
  title: string | null;
  description: string | null;
  type_of_listing: ListingType | null;
  status_code: string | null;
  shipment_code: string | null;
  departure_date: string | null;
  max_weight_kg: number | null;
  price_per_unit: number | null;
  currency_code: string | null;
  photos: string[] | null;
  is_verified: boolean | null;
  created_at: string | null;
  owner: {
    id: string;
    full_name: string | null;
    bucket_avatar_url: string | null;
  } | null;
  origin: {
    id: string;
    city: string | null;
    name: string | null;
    iata_code: string | null;
  } | null;
  destination: {
    id: string;
    city: string | null;
    name: string | null;
    iata_code: string | null;
  } | null;
};

export type ListingsResponse = {
  travellers: TravellerListing[];
  shipments: ShipmentRequest[];
  total: number;
  tookMs: number;
  params: {
    q: string | null;
    segment: SearchSegment;
  };
};

export type ListingRow = Omit<Tables<'listings'>, 'owner_id,origin_id,destination_id,'> & {
  owner: {
    id: string;
    full_name: string | null;
    bucket_avatar_url: string | null;
  } | null;
  origin: {
    id: string;
    city: string | null;
    name: string | null;
    iata_code: string | null;
  } | null;
  destination: {
    id: string;
    city: string | null;
    name: string | null;
    iata_code: string | null;
  } | null;
}