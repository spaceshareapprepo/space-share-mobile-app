// hooks/use-date-picker.tsx
import { useState, useMemo } from "react";
import DateTimePicker, {
  DateType,
  useDefaultStyles,
} from "react-native-ui-datepicker";

type UseDatePickerProps = {
  initialDate?: DateType;
  onSelect?: (date: DateType) => void;
};

export function useDatePicker({ initialDate, onSelect }: UseDatePickerProps = {}) {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>(initialDate);

  const Picker = useMemo(
    () => (
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={({ date }) => {
          setSelected(date);
          onSelect?.(date);
        }}
        styles={defaultStyles}
      />
    ),
    [selected, defaultStyles, onSelect]
  );

  return { selected, setSelected, Picker };
}
