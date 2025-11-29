import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

import { ListingForm, ListingFormValues } from "@/components/listings/listing-form";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";

export default function EditListing() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const listingId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [initialValues, setInitialValues] = useState<Partial<ListingFormValues> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadListing() {
      if (!listingId) {
        setLoadError("Missing listing id.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", listingId)
          .single();

        if (error) {
          throw error;
        }

        if (data && isMounted) {
          setInitialValues({
            title: data.title ?? "",
            description: data.description ?? "",
            originId: data.origin_id ?? "",
            originLabel:
              data.origin?.name && data.origin?.iata_code
                ? `${data.origin.name} (${data.origin.iata_code})`
                : data.origin?.name ?? data.origin_id ?? "",
            destinationId: data.destination_id ?? "",
            destinationLabel:
              data.destination?.name && data.destination?.iata_code
                ? `${data.destination.name} (${data.destination.iata_code})`
                : data.destination?.name ?? data.destination_id ?? "",
            departureDate: data.departure_date ?? "",
            typeOfListing: (data.type_of_listing as ListingFormValues["typeOfListing"]) ?? "travel",
            shipmentCode: (data.shipment_code as ListingFormValues["shipmentCode"]) ?? "matching",
            pricePerUnit: data.price_per_unit ? String(data.price_per_unit) : "",
            maxWeight: data.max_weight_kg ? String(data.max_weight_kg) : "",
            currencyCode: data.currency_code === "GHS" ? "GHS" : "USD",
          });
        }
      } catch (err) {
        console.warn("Failed to load listing for edit", err);
        if (isMounted) {
          setLoadError("Could not load listing. Please try again.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadListing();
    return () => {
      isMounted = false;
    };
  }, [listingId]);

  if (!listingId) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit listing" }} />
        <ThemedView safeArea className="p-6 gap-3">
          <ThemedText type="title">Edit listing</ThemedText>
          <ThemedText>Listing id is missing.</ThemedText>
        </ThemedView>
      </>
    );
  }

  if (loadError) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit listing" }} />
        <ThemedView safeArea className="p-6 gap-3">
          <ThemedText type="title">Edit listing</ThemedText>
          <ThemedText>{loadError}</ThemedText>
        </ThemedView>
      </>
    );
  }

  return (
    <ListingForm
      mode="edit"
      listingId={listingId}
      headerTitle="Edit listing"
      headerSubtitle="Update your route or shipment details and save to keep travellers informed."
      initialValues={initialValues ?? undefined}
      isLoading={isLoading}
    />
  );
}
