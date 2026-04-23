export const DEFAULT_OTHER_OPTION_KEY = "other";

export interface AppMultiSelectItem {
  id: string;
  name: string;
}

export interface AppMultiSelectProps {
  items: AppMultiSelectItem[];
  value?: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  label: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  /** When provided, adds an "other" option. When selected, shows an input in the adjacent column. */
  otherOptionKey?: string;
  otherOptionLabel?: string;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  onOtherBlur?: () => void;
  otherLabel?: string;
  otherPlaceholder?: string;
  otherError?: string;
  /** Max number of selected items to display in the trigger. Extra items are shown as "...". */
  maxDisplayItems?: number;
  /** Show loading spinner in the select. */
  isLoading?: boolean;
  /** Show search input in the dropdown. Default: true */
  showSearch?: boolean;
}
