import React from "react";
import { ListingForm } from "@/components/listings/listing-form";

export default function PublishListing() {
  return (
    <ListingForm
      mode="create"
      headerTitle="Create a listing"
      headerSubtitle="Share your route or shipment. Use the autocomplete fields to set the origin and destination airports."
    />
  );
}
