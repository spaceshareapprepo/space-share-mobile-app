import React, { memo, useCallback, useEffect, useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
} from "@/components/ui/popover";
import { LocationsResponse } from "@/constants/types";
import { Ionicons } from "@expo/vector-icons";

type SearchDropdownProps = {
  value?: string;
  onSelectId?: (id: string | null, label?: string) => void;
  placeholder?: string;
  label?: string;
  iconName: string;
};

type SearchDropdownItem = {
    id: string;
    title?: string | null | undefined;
}

export const SearchDropdown = memo (
  ({ 
    value, 
    label, 
    onSelectId, 
    placeholder = 'Airport, City, Item ..',
    iconName }: SearchDropdownProps ) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<SearchDropdownItem[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [loading, setLoading] = useState(false)

  const handleSearch = useCallback(async (q: string) => {
    const filterToken = q.trim().toLowerCase();

    if (filterToken.length < 3) {
      setFilteredData([]);
      setIsDropdownOpen(false);
      setShowPopover(false);
      return;
    }
    setLoading(true)
    try{
      const params = new URLSearchParams({ q: filterToken })
      const response = await fetch(`/api/location?${params.toString()}`, { method: "GET" })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const payload: LocationsResponse = await response.json();
      const suggestions = (payload.data ?? [])
        .filter((item) => item.label?.toLowerCase().includes(filterToken))
        .map((item) => ({
          id: String(item.id),
          title: String(item.label) ?? '',
        }));
      setFilteredData(suggestions);
      const hasResults = suggestions.length > 0;
      setIsDropdownOpen(hasResults);
      setShowPopover(hasResults);
    } catch (error) {
      console.error('Location search failed:', error);
      setFilteredData([]);
      setIsDropdownOpen(false);
      setShowPopover(false);
    } finally {
      setLoading(false);
    }

  },[]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void handleSearch(searchText);
    }, 600);
    return () => clearTimeout(timeoutId);
  }, [searchText, handleSearch]);

  const handleSelectItem = (item: SearchDropdownItem) => {
    setSearchText(item.title ?? "");
    setIsDropdownOpen(false);
    setShowPopover(false);
    onSelectId?.(item.id, item.title ?? undefined);
  };
  console.log(`searchText: ${searchText}`)

  return (
    <View style={styles.container}>
      <Popover
        isOpen={showPopover && isDropdownOpen && filteredData.length > 0}
        onClose={() => {
          setShowPopover(false);
          setIsDropdownOpen(false);
        }}
        onOpen={() => setShowPopover(true)}
        placement="bottom left"
        offset={5}
        trigger={(triggerProps) => (
          <View style={styles.inputWrapper} {...triggerProps}>
            <Ionicons name={iconName as any} size={18} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder={placeholder}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}
      >
        <PopoverBackdrop />
        <PopoverContent className="max-w-[473px] w-full native:max-w-[300px]">
          {/* <PopoverArrow /> */}
          <PopoverHeader className="w-full gap-3">
            {/* <PopoverCloseButton /> */}
          </PopoverHeader>
          <PopoverBody className="gap-6">
            <View style={styles.dropdownContainer}>
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleSelectItem(item)}
                  >
                    <Text>{item.title}</Text>
                  </TouchableOpacity>
                )}
                extraData={onSelectId}
                refreshing={loading}
              />
            </View>
          </PopoverBody>
          <PopoverFooter />
        </PopoverContent>
      </Popover>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {},
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
  },
  dropdownContainer: {},
  dropdownItem: {
    paddingVertical: 12,
  },
  inputWrapper: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  }
});
