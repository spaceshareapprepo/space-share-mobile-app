import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

type SearchDropdownContextValue = {
  selectedId: string | null;
  selectedLabel: string | null;
  setSelectedValue: (id: string | null, label?: string | null) => void;
};

const SearchDropdownContext = createContext<
  SearchDropdownContextValue | undefined
>(undefined);

export function SearchDropdownProvider({ children }: PropsWithChildren) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      selectedId,
      selectedLabel,
      setSelectedValue: (id: string | null, label?: string | null) => {
        setSelectedId(id);
        setSelectedLabel(label ?? null);
      },
    }),
    [selectedId, selectedLabel]
  );

  return (
    <SearchDropdownContext.Provider value={value}>
      {children}
    </SearchDropdownContext.Provider>
  );
}

export function useSearchDropdownContext() {
  const ctx = useContext(SearchDropdownContext);
  if (!ctx) {
    throw new Error(
      "useSearchDropdownContext must be used within a SearchDropdownProvider"
    );
  }
  return ctx;
}

export function useOptionalSearchDropdownContext() {
  return useContext(SearchDropdownContext);
}
