export type SegmentKey = 'routes' | 'items';

export type QuickFilter = {
  label: string;
  value: string;
  segment: SegmentKey;
};

export type Listings ={
    id: string;
    ownerId: string;
    title: string;
    description: string;
    originId: string;
    originName: string;
    desitnationId: string;
    destinationName: string;
    flightDate: string;
    maxWeightKg: number;
    maxWeightLb: number;
    pricePerUnit: number;
    currencyCode: string;
    photos: string[];
    isVerified: boolean;
    typeOfListing: string;
    statusCode: string;
    shipmentCode: string
}