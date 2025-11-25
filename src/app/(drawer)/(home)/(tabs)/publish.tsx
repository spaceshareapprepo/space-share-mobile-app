import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet
} from "react-native";

import AuthButton from "@/components/auth/auth-button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useRouter } from "expo-router";

import { AutocompleteDropdownControl } from '@/components/autocomplete-dropdown';
import { HStack } from "@/components/ui/hstack";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Tables, TablesInsert } from "@/lib/database/supabase.types";
import { supabase } from "@/lib/supabase";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type ListingType = Tables<'listings'>["type_of_listing"];
type ShipmentCode = Tables<'listings'>["shipment_code"];

type ValidationErrors = Partial<
  Record<
    | "title"
    | "description"
    | "originId"
    | "destinationId"
    | "departureDate"
    | "type"
    | "price"
    | "maxWeight"
    | "currency"
    | "owner"
    | "submit",
    string
  >
>;

type StatusMessage =
  | { variant: "error" | "success"; text: string }
  | null;

const listingTypeOptions: { label: string; value: ListingType; helper: string }[] = [
  { label: "Space to sell", value: "travel", helper: "List extra luggage space and routes" },
  { label: "Item to send", value: "shipment", helper: "Post items that need a traveller" },
];

export default function CreateListing() {
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor(
    { light: '#D9E2F9', dark: '#252B3E' },
    'background'
  );
  const backgroundColor = useThemeColor(
    { light: '#F2F6FF', dark: '#151B2A' },
    'background'
  );
  const inputTextColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'textSecondary');
  const isWeb = Platform.OS === "web";

  const router = useRouter();
  const { session } = useAuthContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [typeOfListing, setTypeOfListing] = useState<ListingType>("travel");
  const [shipmentCode, setShipmentCode] = useState<ShipmentCode>("matching");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [currencyCode, setCurrencyCode] = useState<"USD" | "GHS">("USD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const ownerId = session?.user?.id ?? null;

  const parsedDepartureDate = useMemo(() => {
    const date = new Date(departureDate);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }, [departureDate]);

  const displayDepartureDate = useMemo(() => {
    if (!parsedDepartureDate) return "";
    const date = new Date(parsedDepartureDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [parsedDepartureDate]);

  const pickerValue = useMemo(() => {
    if (!parsedDepartureDate) return new Date();
    const date = new Date(parsedDepartureDate);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }, [parsedDepartureDate]);

  function handleDepartureDateChange(
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    const nextDate = selectedDate ?? pickerValue;
    setDepartureDate(nextDate.toISOString());
    setShowDatePicker(false);
  }

  function openDatePicker() {
    setShowDatePicker(true);
  }

  function validate(): boolean {
    const errors: ValidationErrors = {};

    if (!ownerId) {
      errors.owner = "You must be signed in to create a listing.";
    }

    if (!title.trim()) {
      errors.title = "Title is required.";
    } else if (title.trim().length < 6) {
      errors.title = "Title must be at least 6 characters.";
    }

    if (!description.trim()) {
      errors.description = "Description is required.";
    } else if (description.trim().length < 20) {
      errors.description = "Description should be at least 20 characters.";
    }

    if (!originId.trim()) {
      errors.originId = "Origin airport is required.";
    }

    if (!destinationId.trim()) {
      errors.destinationId = "Destination airport is required.";
    }

    if (!parsedDepartureDate) {
      errors.departureDate = "Enter a valid departure date (e.g. 2025-12-30).";
    }

    if (!typeOfListing) {
      errors.type = "Select a listing type.";
    }

    if (pricePerUnit) {
      const price = Number(pricePerUnit);
      if (Number.isNaN(price) || price <= 0) {
        errors.price = "Price must be a positive number.";
      }
    }

    if (maxWeight) {
      const weight = Number(maxWeight);
      if (Number.isNaN(weight) || weight <= 0) {
        errors.maxWeight = "Max weight must be a positive number.";
      }
    }

    if (!currencyCode) {
      errors.currency = "Currency is required.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit() {
    setStatusMessage(null);

    const isValid = validate();
    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: TablesInsert<'listings'> = {
        owner_id: ownerId as string,
        title: title.trim(),
        description: description.trim(),
        origin_id: originId.trim(),
        destination_id: destinationId.trim(),
        departure_date: parsedDepartureDate as string,
        type_of_listing: typeOfListing,
        shipment_code: typeOfListing === "shipment" ? shipmentCode : null,
        status_code: "0",
        max_weight_kg: maxWeight ? Number(maxWeight) : null,
        max_weight_lb: null,
        price_per_unit: pricePerUnit ? Number(pricePerUnit) : null,
        currency_code: currencyCode,
        photos: [],
        is_verified: false,
      };

      const { data, error } = await supabase
        .from("listings")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        setStatusMessage({ variant: "error", text: error.message });
        return;
      }

      setStatusMessage({
        variant: "success",
        text: "Listing created. Redirecting to details...",
      });
      if (data?.id) {
        router.replace(`/listings/${data.id}?segment=${typeOfListing}`);
      } else {
        router.replace("/(drawer)/(home)/(tabs)");
      }
    } catch (error) {
      console.error("Failed to create listing:", error);
      setStatusMessage({
        variant: "error",
        text: "Something went wrong while creating your listing.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ThemedView safeArea style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.header}>
          <ThemedText type="title" accessibilityRole="header">
            Create a listing
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Share your route or shipment. Use the autocomplete fields to set the
            origin and destination airports.
          </ThemedText>
        </ThemedView>

        {statusMessage && (
          <Alert
            action={statusMessage.variant === "error" ? "error" : "success"}
            variant="outline"
            className="w-full"
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
          >
            <AlertIcon
              as={
                statusMessage.variant === "error"
                  ? AlertCircleIcon
                  : CheckCircleIcon
              }
            />
            <AlertText>{statusMessage.text}</AlertText>
          </Alert>
        )}

        <VStack space="lg" className="w-full">
          <FormControl isInvalid={Boolean(validationErrors.title)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Listing title</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={title}
                onChangeText={setTitle}
                placeholder="e.g. JFK → ACC with 18kg space"
                autoCapitalize="sentences"
                accessibilityLabel="Listing title"
                accessibilityHint="Enter a short, clear title"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.inputField,
                  {
                    color: tintColor,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                  },
                ]}
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Make it specific so travellers can trust it.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.title && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.title}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl
            isInvalid={Boolean(validationErrors.description)}
            size="sm"
          >
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Description</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput
                value={description}
                onChangeText={setDescription}
                placeholder="What are you offering or shipping? Include timing and restrictions."
                autoCapitalize="sentences"
                accessibilityLabel="Listing description"
                accessibilityHint="Describe the route, cargo, and expectations"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.inputField,
                  {
                    color: tintColor,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                  },
                ]}
                multiline
                numberOfLines={4}
              />
            </Textarea>
            <FormControlHelper>
              <FormControlHelperText>
                At least 20 characters. Mention verification, timing, and any
                limits.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.description && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.description}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <ThemedView style={styles.segmentSection}>
            <ThemedText style={styles.segmentLabel}>Listing type</ThemedText>
            <HStack style={styles.segmentButtons}>
              {listingTypeOptions.map((option) => {
                const isActive = typeOfListing === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setTypeOfListing(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    style={[
                      styles.segmentButton,
                      isActive && styles.segmentButtonActive,
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.segmentButtonText,
                        isActive && styles.segmentButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                    <ThemedText style={styles.segmentHelper}>
                      {option.helper}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </HStack>
            {validationErrors.type && (
              <ThemedText style={styles.inlineError}>
                {validationErrors.type}
              </ThemedText>
            )}
          </ThemedView>

          <FormControl isInvalid={Boolean(validationErrors.originId)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Origin airport</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <AutocompleteDropdownControl
              value={originId}
              onSelectId={(id) => setOriginId(id ?? "")}
              placeholder="Search for an origin airport"
            />
            <FormControlHelper>
              <FormControlHelperText>
                Pick an airport to set the origin ID automatically.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.originId && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.originId}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl
            isInvalid={Boolean(validationErrors.destinationId)}
            size="sm"
          >
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Destination airport</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <AutocompleteDropdownControl
              value={destinationId}
              onSelectId={(id) => setDestinationId(id ?? "")}
              placeholder="Search for a destination airport"
            />
            <FormControlHelper>
              <FormControlHelperText>
                Pick an airport to set the destination ID automatically.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.destinationId && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.destinationId}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl
            isInvalid={Boolean(validationErrors.departureDate)}
            size="sm"
          >
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Departure date</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            {isWeb ? (
              <Input>
                <InputField
                  value={departureDate}
                  onChangeText={setDepartureDate}
                  placeholder="2025-12-30 or 2025-12-30T18:30:00Z"
                  placeholderTextColor={placeholderColor}
                  style={[
                    styles.inputField,
                    {
                      color: tintColor,
                      borderColor: borderColor,
                      backgroundColor: backgroundColor,
                    },
                  ]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Departure date"
                />
              </Input>
            ) : (
              <>
                <Pressable
                  onPress={openDatePicker}
                  accessibilityRole="button"
                  accessibilityHint="Choose a departure date from the picker"
                  style={styles.datePressable}
                >
                  <Input pointerEvents="none">
                    <InputField
                      value={displayDepartureDate}
                      placeholder="Pick a departure date"
                      placeholderTextColor={placeholderColor}
                      style={[
                        styles.inputField,
                        {
                          color: tintColor,
                          borderColor: borderColor,
                          backgroundColor: backgroundColor,
                        },
                      ]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      accessibilityLabel="Departure date"
                      editable={false}
                      showSoftInputOnFocus={false}
                    />
                  </Input>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    value={pickerValue}
                    onChange={handleDepartureDateChange}
                  />
                )}
              </>
            )}
            <FormControlHelper>
              <FormControlHelperText>
                {isWeb
                  ? "Enter an ISO date on web; on mobile you can pick a date and we store it as ISO for Supabase."
                  : "Tap to pick a date; we store it as an ISO value for Supabase."
                }
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.departureDate && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.departureDate}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(validationErrors.price)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Price per unit</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={pricePerUnit}
                onChangeText={setPricePerUnit}
                placeholder="e.g. 15 (per kg)"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.inputField,
                  {
                    color: tintColor,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                  },
                ]}
                keyboardType="decimal-pad"
                accessibilityLabel="Price per unit"
              />
            </Input>
            <FormControlHelper>
              <FormControlHelperText>
                Optional, but helps travellers match quickly.
              </FormControlHelperText>
            </FormControlHelper>
            {validationErrors.price && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.price}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl
            isInvalid={Boolean(validationErrors.maxWeight)}
            size="sm"
          >
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Max weight (kg)</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={maxWeight}
                onChangeText={setMaxWeight}
                placeholder="e.g. 18"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.inputField,
                  {
                    color: tintColor,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                  },
                ]}
                keyboardType="decimal-pad"
                accessibilityLabel="Max weight in kilograms"
              />
            </Input>
            {validationErrors.maxWeight && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.maxWeight}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          <FormControl isInvalid={Boolean(validationErrors.currency)} size="sm">
            <FormControlLabel>
              <FormControlLabelText>
                <ThemedText>Currency</ThemedText>
              </FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                value={currencyCode}
                onChangeText={(value) =>
                  setCurrencyCode(value.toUpperCase() === "GHS" ? "GHS" : "USD")
                }
                placeholder="USD or GHS"
                placeholderTextColor={placeholderColor}
                style={[
                  styles.inputField,
                  {
                    color: tintColor,
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                  },
                ]}
                autoCapitalize="characters"
                autoCorrect={false}
                accessibilityLabel="Currency code"
              />
            </Input>
            {validationErrors.currency && (
              <FormControlError>
                <FormControlErrorIcon
                  as={AlertCircleIcon}
                  className="text-red-500"
                />
                <FormControlErrorText className="text-red-500">
                  {validationErrors.currency}
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {typeOfListing === "shipment" && (
            <ThemedView style={styles.segmentSection}>
              <ThemedText style={styles.segmentLabel}>
                Shipment priority
              </ThemedText>
              <HStack style={styles.segmentButtons}>
                {(["matching", "urgent"] as ShipmentCode[]).map((code) => {
                  const isActive = shipmentCode === code;
                  return (
                    <Pressable
                      key={code}
                      onPress={() => setShipmentCode(code)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isActive }}
                      style={[
                        styles.segmentButton,
                        isActive && styles.segmentButtonActive,
                      ]}
                    >
                      <ThemedText
                        style={[
                          styles.segmentButtonText,
                          isActive && styles.segmentButtonTextActive,
                        ]}
                      >
                        {code === "urgent" ? "Urgent" : "Matching"}
                      </ThemedText>
                      <ThemedText style={styles.segmentHelper}>
                        {code === "urgent"
                          ? "Surface this request at the top for travellers."
                          : "Standard visibility in search."}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </HStack>
            </ThemedView>
          )}
        </VStack>

        <ThemedView style={styles.footer}>
          <AuthButton
            className="w-full self-end"
            size="md"
            variant="solid"
            isDisabled={isSubmitting}
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting, busy: isSubmitting }}
            accessibilityHint="Submit your listing to SpaceShare"
            buttonText={isSubmitting ? "Submitting..." : "Create listing"}
            onPress={() => {
              void handleSubmit();
            }}
          />
          {isSubmitting && (
            <ThemedView style={styles.submittingRow}>
              <ActivityIndicator size="small" />
              <ThemedText style={styles.submittingText}>
                Saving listing...
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 22,
  },
  header: {
    gap: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.8,
  },
  inputField: {},
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  segmentSection: {
    gap: 10,
  },
  segmentLabel: {
    fontWeight: "700",
    fontSize: 14,
  },
  segmentButtons: {
    gap: 10,
  },
  segmentButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 4,
    borderColor: "#E5E7EB",
  },
  segmentButtonActive: {
    borderColor: "#0A7EA4",
    backgroundColor: "rgba(10, 126, 164, 0.08)",
  },
  segmentButtonText: {
    fontWeight: "700",
    fontSize: 15,
  },
  segmentButtonTextActive: {
    color: "#0A7EA4",
  },
  segmentHelper: {
    fontSize: 13,
    opacity: 0.8,
  },
  datePressable: {
    width: "100%",
  },
  inlineError: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 4,
  },
  footer: {
    gap: 10,
  },
  submittingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submittingText: {
    fontSize: 14,
  },
});
