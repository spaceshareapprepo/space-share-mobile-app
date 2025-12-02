// Shared listing form for create and edit flows.
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Stack, useRouter } from "expo-router";

import AuthButton from "@/components/auth/auth-button";
import { AutocompleteDropdownControl } from "@/components/autocomplete-dropdown";
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
import { HStack } from "@/components/ui/hstack";
import {
  AlertCircleIcon,
  CheckCircleIcon,
  ChevronDownIcon,
} from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useThemeColor } from "@/hooks/use-theme-color";
import type { Tables, TablesInsert, TablesUpdate } from "@/lib/database/supabase.types";
import { supabase } from "@/lib/supabase";
import { Switch } from "../ui/switch";

export type ListingFormValues = {
  title: string;
  description: string;
  originId: string;
  originLabel?: string;
  destinationId: string;
  destinationLabel?: string;
  departureDate: string;
  typeOfListing: Tables<"listings">["type_of_listing"];
  shipmentCode: Tables<"listings">["shipment_code"];
  pricePerUnit: string;
  maxWeight: string;
  currencyCode: "USD" | "GHS";
};

type ListingFormProps = {
  mode: "create" | "edit";
  listingId?: string;
  headerTitle: string;
  headerSubtitle: string;
  initialValues?: Partial<ListingFormValues>;
  isLoading?: boolean;
};

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

const listingTypeOptions: {
  label: string;
  value: Tables<"listings">["type_of_listing"];
  helper: string;
}[] = [
  {
    label: "Space to sell",
    value: "travel",
    helper: "List extra luggage space and routes",
  },
  {
    label: "Item to send",
    value: "shipment",
    helper: "Post items that need a traveller",
  },
];

const defaultValues: ListingFormValues = {
  title: "",
  description: "",
  originId: "",
  originLabel: "",
  destinationId: "",
  destinationLabel: "",
  departureDate: "",
  typeOfListing: "travel",
  shipmentCode: "matching",
  pricePerUnit: "",
  maxWeight: "",
  currencyCode: "USD",
};

export function ListingForm({
  mode,
  listingId,
  headerTitle,
  headerSubtitle,
  initialValues,
  isLoading = false,
}: ListingFormProps) {
  const router = useRouter();
  const { session } = useAuthContext();

  const tintColor = useThemeColor({}, "tint");
  const borderColor = useThemeColor(
    { light: "#D9E2F9", dark: "#252B3E" },
    "background"
  );
  const backgroundColor = useThemeColor(
    { light: "#F2F6FF", dark: "#151B2A" },
    "background"
  );
  const placeholderColor = useThemeColor({}, "textSecondary");

  const [title, setTitle] = useState(defaultValues.title);
  const [description, setDescription] = useState(defaultValues.description);
  const [originId, setOriginId] = useState(defaultValues.originId);
  const [originLabel, setOriginLabel] = useState(defaultValues.originLabel);
  const [destinationId, setDestinationId] = useState(defaultValues.destinationId);
  const [destinationLabel, setDestinationLabel] = useState(defaultValues.destinationLabel);
  const [departureMonth, setDepartureMonth] = useState("");
  const [departureDay, setDepartureDay] = useState("");
  const [departureYear, setDepartureYear] = useState("");
  const [typeOfListing, setTypeOfListing] =
    useState<Tables<"listings">["type_of_listing"]>(defaultValues.typeOfListing);
  const [shipmentCode, setShipmentCode] =
    useState<Tables<"listings">["shipment_code"]>(defaultValues.shipmentCode);
  const [pricePerUnit, setPricePerUnit] = useState(defaultValues.pricePerUnit);
  const [maxWeight, setMaxWeight] = useState(defaultValues.maxWeight);
  const [currencyCode, setCurrencyCode] =
    useState<"USD" | "GHS">(defaultValues.currencyCode);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);

  const ownerId = session?.user?.id ?? null;
  const currentYear = useMemo(() => new Date().getUTCFullYear(), []);
  const currentMonth = useMemo(() => new Date().getUTCMonth() + 1, []);
  const currentDay = useMemo(() => new Date().getUTCDate(), []);

  const monthOptions = useMemo(
    () =>
      [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].map((label, index) => ({
        label,
        value: String(index + 1).padStart(2, "0"),
      })),
    []
  );

  const dayOptions = useMemo(
    () =>
      Array.from({ length: 31 }, (_, index) => {
        const value = String(index + 1).padStart(2, "0");
        return { label: value, value };
      }),
    []
  );

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 31 }, (_, index) =>
        String(currentYear + index)
      ),
    [currentYear]
  );

  function setDeparturePartsFromValue(value?: string | null) {
    if (!value) {
      setDepartureMonth("");
      setDepartureDay("");
      setDepartureYear("");
      return;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      setDepartureMonth("");
      setDepartureDay("");
      setDepartureYear("");
      return;
    }

    setDepartureMonth(String(parsed.getUTCMonth() + 1).padStart(2, "0"));
    setDepartureDay(String(parsed.getUTCDate()).padStart(2, "0"));
    setDepartureYear(String(parsed.getUTCFullYear()));
  }

  function normalizeToFutureDate(parts: {
    year: string;
    month: string;
    day: string;
  }) {
    const yearNum = Number(parts.year);
    const monthNum = Number(parts.month);
    const dayNum = Number(parts.day);

    if (Number.isNaN(yearNum)) {
      return parts;
    }

    if (!Number.isNaN(monthNum) && yearNum === currentYear) {
      if (monthNum < currentMonth) {
        return { year: parts.year, month: "", day: "" };
      }
      if (monthNum === currentMonth && !Number.isNaN(dayNum) && dayNum < currentDay) {
        return { year: parts.year, month: parts.month, day: "" };
      }
    }

    return parts;
  }

  function handleDeparturePartChange(
    part: "month" | "day" | "year",
    value: string
  ) {
    let nextYear = departureYear;
    let nextMonth = departureMonth;
    let nextDay = departureDay;

    if (part === "year") {
      nextYear = value;
    } else if (part === "month") {
      nextMonth = value;
      nextDay = "";
    } else {
      nextDay = value;
    }

    const normalized = normalizeToFutureDate({
      year: nextYear,
      month: nextMonth,
      day: nextDay,
    });

    setDepartureYear(normalized.year);
    setDepartureMonth(normalized.month);
    setDepartureDay(normalized.day);
    setValidationErrors((prev) => ({ ...prev, departureDate: undefined }));
  }

  useEffect(() => {
    if (!initialValues) return;
    setTitle(initialValues.title ?? defaultValues.title);
    setDescription(initialValues.description ?? defaultValues.description);
    setOriginId(initialValues.originId ?? defaultValues.originId);
    setOriginLabel(initialValues.originLabel ?? initialValues.originId ?? "");
    setDestinationId(initialValues.destinationId ?? defaultValues.destinationId);
    setDestinationLabel(
      initialValues.destinationLabel ?? initialValues.destinationId ?? ""
    );
    setDeparturePartsFromValue(
      initialValues.departureDate ?? defaultValues.departureDate
    );
    setTypeOfListing(
      (initialValues.typeOfListing as Tables<"listings">["type_of_listing"]) ??
        defaultValues.typeOfListing
    );
    setShipmentCode(
      (initialValues.shipmentCode as Tables<"listings">["shipment_code"]) ??
        defaultValues.shipmentCode
    );
    setPricePerUnit(initialValues.pricePerUnit ?? defaultValues.pricePerUnit);
    setMaxWeight(initialValues.maxWeight ?? defaultValues.maxWeight);
    setCurrencyCode(
      initialValues.currencyCode === "GHS" ? "GHS" : defaultValues.currencyCode
    );
  }, [initialValues]);

  const parsedDepartureDate = useMemo(() => {
    if (!departureYear || !departureMonth || !departureDay) return null;

    const yearNum = Number(departureYear);
    const monthNum = Number(departureMonth);
    const dayNum = Number(departureDay);

    if ([yearNum, monthNum, dayNum].some(Number.isNaN)) return null;

    const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum));

    if (
      date.getUTCFullYear() !== yearNum ||
      date.getUTCMonth() + 1 !== monthNum ||
      date.getUTCDate() !== dayNum
    ) {
      return null;
    }

    return date.toISOString();
  }, [departureDay, departureMonth, departureYear]);

  function validate(): boolean {
    const errors: ValidationErrors = {};

    if (!ownerId) {
      errors.owner =
        mode === "edit"
          ? "You must be signed in to update a listing."
          : "You must be signed in to create a listing.";
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
      errors.departureDate = "Select a valid departure date (today or later).";
    } else {
      const now = new Date();
      const todayUtc = Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      );
      const selectedUtc = Date.parse(parsedDepartureDate);

      if (Number.isNaN(selectedUtc) || selectedUtc < todayUtc) {
        errors.departureDate = "Departure date must be today or later.";
      }
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

    if (mode === "edit" && !listingId) {
      setStatusMessage({
        variant: "error",
        text: "Missing listing id.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const payload: TablesInsert<"listings"> = {
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
          router.replace("/");
        }
      } else {
        const payload: TablesUpdate<"listings"> = {
          title: title.trim(),
          description: description.trim(),
          origin_id: originId.trim(),
          destination_id: destinationId.trim(),
          departure_date: parsedDepartureDate as string,
          type_of_listing: typeOfListing,
          shipment_code: typeOfListing === "shipment" ? shipmentCode : null,
          max_weight_kg: maxWeight ? Number(maxWeight) : null,
          max_weight_lb: null,
          price_per_unit: pricePerUnit ? Number(pricePerUnit) : null,
          currency_code: currencyCode,
        };

        const { error } = await supabase
          .from("listings")
          .update(payload)
          .eq("id", listingId as string);

        if (error) {
          setStatusMessage({ variant: "error", text: error.message });
          return;
        }

        setStatusMessage({
          variant: "success",
          text: "Listing updated successfully.",
        });
        router.replace(`/listings/${listingId}`);
      }
    } catch (error) {
      console.error("Failed to submit listing:", error);
      setStatusMessage({
        variant: "error",
        text:
          mode === "edit"
            ? "Something went wrong while updating your listing."
            : "Something went wrong while creating your listing.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ title: headerTitle }} />
        <ThemedView safeArea style={styles.safeArea}>
          <ThemedView style={styles.loadingState}>
            <ActivityIndicator size="large" />
            <ThemedText>Loading listing...</ThemedText>
          </ThemedView>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: headerTitle }} />
      <ThemedView safeArea style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title" accessibilityRole="header">
              {headerTitle}
            </ThemedText>
            <ThemedText style={styles.subtitle}>{headerSubtitle}</ThemedText>
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
              <VStack space="xs">
                <HStack style={styles.segmentSwitchRow}>
                  <ThemedText style={styles.segmentSwitchLabel}>
                    Space to sell
                  </ThemedText>
                  <Switch
                    value={typeOfListing === "shipment"}
                    size="lg"
                    trackColor={{ false: "#d4d4d4", true: "#525252" }}
                    thumbColor="#fafafa"
                    ios_backgroundColor="#d4d4d4"
                    onValueChange={(isShipment) =>
                      setTypeOfListing(isShipment ? "shipment" : "travel")
                    }
                    accessibilityLabel="Toggle listing type"
                    accessibilityState={{
                      checked: typeOfListing === "shipment",
                    }}
                  />
                  <ThemedText style={styles.segmentSwitchLabel}>
                    Item to send
                  </ThemedText>
                </HStack>
                <ThemedText style={styles.segmentHelper}>
                  {
                    listingTypeOptions.find(
                      (option) => option.value === typeOfListing
                    )?.helper
                  }
                </ThemedText>
              </VStack>
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
              label={originLabel}
              onSelectId={(id, label) => {
                setOriginId(id ?? "");
                setOriginLabel(label ?? "");
              }}
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
              label={destinationLabel}
              onSelectId={(id, label) => {
                setDestinationId(id ?? "");
                setDestinationLabel(label ?? "");
              }}
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
              size="md"
            >
              <FormControlLabel>
                <FormControlLabelText>
                  <ThemedText>Departure date</ThemedText>
                </FormControlLabelText>
              </FormControlLabel>
              <HStack style={styles.dateRow}>
                <Select
                  selectedValue={departureMonth}
                  onValueChange={(value) =>
                    handleDeparturePartChange("month", value)
                  }
                  style={styles.dateSelect}
                >
                  <SelectTrigger size="lg">
                    <SelectInput placeholder="Month" 
                    style={[
                    styles.inputField,
                    {
                      color: tintColor,
                      borderColor: borderColor,
                      backgroundColor: backgroundColor,
                    },
                  ]}/>
                    <SelectIcon as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectScrollView>
                        {monthOptions.map((option) => {
                          const isDisabled =
                            departureYear === String(currentYear) &&
                            Number(option.value) < currentMonth;
                          return (
                            <SelectItem
                              key={option.value}
                              label={option.label}
                              value={option.value}
                              isDisabled={isDisabled}
                            />
                          );
                        })}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>

                <Select
                  selectedValue={departureDay}
                  onValueChange={(value) =>
                    handleDeparturePartChange("day", value)
                  }
                  style={styles.dateSelect}
                >
                  <SelectTrigger size="lg">
                    <SelectInput placeholder="Day" 
                    style={[
                    styles.inputField,
                    {
                      color: tintColor,
                      borderColor: borderColor,
                      backgroundColor: backgroundColor,
                    },
                  ]}/>
                    <SelectIcon as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectScrollView >
                        {dayOptions.map((option) => {
                          const isDisabled =
                            departureYear === String(currentYear) &&
                            departureMonth ===
                              String(currentMonth).padStart(2, "0") &&
                            Number(option.value) < currentDay;
                          return (
                            <SelectItem
                              key={option.value}
                              label={option.label}
                              value={option.value}
                              isDisabled={!departureMonth || isDisabled}
                            />
                          );
                        })}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>

                <Select
                  selectedValue={departureYear}
                  onValueChange={(value) =>
                    handleDeparturePartChange("year", value)
                  }
                  style={styles.dateSelect}
                >
                  <SelectTrigger size="lg">
                    <SelectInput placeholder="Year"
                    style={[
                    styles.inputField,
                    {
                      color: tintColor,
                      borderColor: borderColor,
                      backgroundColor: backgroundColor,
                    },
                  ]} />
                    <SelectIcon as={ChevronDownIcon} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectScrollView>
                        {yearOptions.map((year) => (
                          <SelectItem key={year} label={year} value={year} />
                        ))}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </HStack>
              <FormControlHelper>
                <FormControlHelperText>
                  Pick month, day, and year. Past dates are not allowed.
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
                <VStack space="xs">
                  <HStack style={styles.segmentSwitchRow}>
                    <ThemedText style={styles.segmentSwitchLabel}>
                      Matching
                    </ThemedText>
                    <Switch
                      value={shipmentCode === "urgent"}
                      size="lg"
                      trackColor={{ false: "#d4d4d4", true: "#525252" }}
                      thumbColor="#fafafa"
                      ios_backgroundColor="#d4d4d4"
                      onValueChange={(isUrgent) =>
                        setShipmentCode(isUrgent ? "urgent" : "matching")
                      }
                      accessibilityLabel="Toggle shipment priority"
                      accessibilityState={{
                        checked: shipmentCode === "urgent",
                      }}
                    />
                    <ThemedText style={styles.segmentSwitchLabel}>
                      Urgent
                    </ThemedText>
                  </HStack>
                  <ThemedText style={styles.segmentHelper}>
                    {shipmentCode === "urgent"
                      ? "Surface this request at the top for travellers."
                      : "Standard visibility in search."}
                  </ThemedText>
                </VStack>
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
              accessibilityHint={
                mode === "edit"
                  ? "Save your listing changes"
                  : "Submit your listing to SpaceShare"
              }
              buttonText={
                isSubmitting
                  ? mode === "edit"
                    ? "Saving..."
                    : "Submitting..."
                  : mode === "edit"
                    ? "Save changes"
                    : "Create listing"
              }
              onPress={() => {
                void handleSubmit();
              }}
            />
            {isSubmitting && (
              <ThemedView style={styles.submittingRow}>
                <ActivityIndicator size="small" />
                <ThemedText style={styles.submittingText}>
                  {mode === "edit" ? "Updating listing..." : "Saving listing..."}
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </>
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
  dateRow: {
    flexDirection: "row",
    gap: 10,
  },
  dateSelect: {
    flex: 1,
  },
  inputField: {},
  segmentSection: {
    gap: 10,
  },
  segmentLabel: {
    fontWeight: "700",
    fontSize: 14,
  },
  segmentSwitchRow: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
  },
  segmentSwitchLabel: {
    fontWeight: "700",
    fontSize: 14,
  },
  segmentHelper: {
    fontSize: 13,
    opacity: 0.8,
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
  loadingState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
});
