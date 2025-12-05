import { LocationsResponse } from '@/constants/types'
import { useThemeColor } from '@/hooks/use-theme-color'
import React, { memo, useCallback, useRef, useState } from 'react'
import { Dimensions, Platform } from 'react-native'
import {
  AutocompleteDropdown,
  type AutocompleteDropdownItem,
  type IAutocompleteDropdownRef,
} from 'react-native-autocomplete-dropdown'
import { ThemedText } from './themed-text'
import { ThemedView } from './themed-view'
import { IconSymbol } from './ui/icon-symbol'

type AutocompleteDropdownControlProps = {
  value?: string;
  onSelectId?: (id: string | null, label?: string) => void;
  placeholder?: string;
  label?: string;
};

export const AutocompleteDropdownControl = memo(
  ({ value, label, onSelectId, placeholder = 'Search for a location' }: AutocompleteDropdownControlProps) => {
  const tintColor = useThemeColor(
    {}, 
    'tint'
  );
  const borderColor = useThemeColor(
    { light: '#D9E2F9', dark: '#252B3E' },
    'background'
  );
  const backgroundColor = useThemeColor(
    { light: '#F2F6FF', dark: '#151B2A' },
    'background'
  );
  const [loading, setLoading] = useState(false)
  const [suggestionsList, setSuggestionsList] = useState<AutocompleteDropdownItem[] | null>(null)
  const dropdownController = useRef<IAutocompleteDropdownRef | null>(null)

  const getSuggestions = useCallback(async (q: string) => {
    const filterToken = q.trim().toLowerCase()

    if (filterToken.length < 3) {
      setSuggestionsList(null)
      return
    }

    setLoading(true)
    try {
      const params = new URLSearchParams({ q: filterToken })
      const response = await fetch(`/api/location?${params.toString()}`, { method: "GET" })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const payload: LocationsResponse = await response.json()
      const suggestions = (payload.data ?? [])
        .filter((item) => item.label?.toLowerCase().includes(filterToken))
        .map((item) => ({
          id: String(item.id),
          title: String(item.label) ?? '',
        }))
      setSuggestionsList(suggestions)
    } catch (error) {
      console.error('Location search failed:', error)
      setSuggestionsList(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const onClearPress = useCallback(() => {
    setSuggestionsList(null)
    onSelectId?.(null)
  }, [onSelectId])

  return (
    <ThemedView
        style={[
          { flex: 1, flexDirection: 'row', alignItems: 'center' },
          Platform.select({ ios: { zIndex: 1 } }),
        ]}>
        <AutocompleteDropdown
          controller={controller => {
            dropdownController.current = controller
          }}
          direction={Platform.select({ ios: 'down', android: 'up', web: 'down' })}
          dataSet={suggestionsList}
          initialValue={value ? { id: value, title: label || value } : undefined}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            const id = item?.id ?? null
            onSelectId?.(id, item?.title ?? '')
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          onClear={onClearPress}
          loading={loading}
          useFilter={false}
          textInputProps={{
            placeholder,
            autoCorrect: true,
            autoCapitalize: 'none',
            style: {
              borderRadius: 5,
              paddingLeft: 18,
              color: `${tintColor}`,
              borderColor: `${borderColor}`,
              backgroundColor: `${backgroundColor}`
            },
          }}
          rightButtonsContainerStyle={{
            right: 18,
            height: 30,
            alignSelf: 'center',
          }}
          inputContainerStyle={{
            borderRadius: 5,
            borderColor: `${borderColor}`,
            backgroundColor: `${backgroundColor}`
          }}
          suggestionsListContainerStyle={{
            backgroundColor: `${backgroundColor}`
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1, borderColor: `${borderColor}` }}
          renderItem={(item: AutocompleteDropdownItem) => (
            <ThemedText style={{ color: `${tintColor}`, padding: 5 }}>{item.title}</ThemedText>
          )}
          ClearIconComponent={<IconSymbol name="clear" size={18} color={tintColor} />}
          inputHeight={45}
          showChevron={false}
          closeOnBlur={false}
          showClear={true}
        />
        {/* <ThemedView style={{ width: 10 }} /> */}
        {/* <Button>
          <ButtonText onPress={() => dropdownController.current?.toggle()} > Toggle</ButtonText>
        </Button> */}
        {/* <ThemedText style={{ color: '#668', fontSize: 13 }}>Selected item id: {JSON.stringify(selectedItem)}</ThemedText> */}
      </ThemedView>
  )
})
