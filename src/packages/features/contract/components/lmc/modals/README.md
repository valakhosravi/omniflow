# Contract Management Modals

This directory contains modal components for managing contract clauses, terms, and subclauses in the contract creation workflow.

## Components

### 1. ClauseModal
Modal for adding and editing contract clauses (مواد قرارداد).

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Handler for closing modal
- `onSubmit`: (data: ClauseFormData) => void - Handler for form submission
- `clause?`: ContractClauseDetails - Optional clause data for editing mode
- `isLoading?`: boolean - Loading state for submit button

**Fields:**
- `name`: Clause name (required)

### 2. TermModal
Modal for adding and editing contract terms (بندهای قرارداد).

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Handler for closing modal
- `onSubmit`: (data: TermFormData) => void - Handler for form submission
- `term?`: TermDetails - Optional term data for editing mode
- `isLoading?`: boolean - Loading state for submit button

**Fields:**
- `title`: Term title (required)
- `initialDescription`: Term description (required, multiline)

### 3. SubClauseModal
Modal for adding and editing contract subclauses/notes (تبصره‌های قرارداد).

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Handler for closing modal
- `onSubmit`: (data: SubClauseFormData) => void - Handler for form submission
- `subClause?`: SubClauseDetails - Optional subclause data for editing mode
- `isLoading?`: boolean - Loading state for submit button

**Fields:**
- `title`: Subclause title (required)
- `description`: Subclause description (required, multiline)

### 4. DeleteConfirmModal
Reusable confirmation modal for delete operations.

**Props:**
- `isOpen`: boolean - Controls modal visibility
- `onClose`: () => void - Handler for closing modal
- `onConfirm`: () => void - Handler for confirming deletion
- `title`: string - Modal title
- `message`: string - Confirmation message
- `isLoading?`: boolean - Loading state for delete button

## Usage Example

```tsx
import ClauseModal from "../components/lmc/modals/ClauseModal";
import { ContractClauseDetails } from "../types/contractModel";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClause, setSelectedClause] = useState<ContractClauseDetails | null>(null);

  const handleSubmit = async (data: ClauseFormData) => {
    // Handle save/update logic
    console.log(data);
    setIsOpen(false);
  };

  return (
    <ClauseModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
      clause={selectedClause}
      isLoading={false}
    />
  );
}
```

## Integration with NonTypeCompleteContractIndex

The `NonTypeCompleteContractIndex` page demonstrates complete integration with these modals:

1. **State Management**: Uses a single `modalState` object to manage all modal states
2. **API Integration**: Connects to RTK Query mutations for CRUD operations
3. **Toast Notifications**: Shows success/error messages using `addToaster`
4. **Automatic Refetch**: Refetches contract data after successful operations
5. **Loading States**: Displays loading indicators during API calls

### Key Features:
- ✅ Add new clauses, terms, and subclauses
- ✅ Edit existing items
- ✅ Delete with confirmation
- ✅ Drag & drop reordering (for clauses)
- ✅ Real-time data synchronization
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Toast notifications

## API Endpoints Used

- `useSaveClauseRequestMutation()` - Create new clause
- `useUpdateClauseMutation()` - Update existing clause
- `useDeleteClauseMutation()` - Delete clause
- `useSaveTermMutation()` - Create new term
- `useUpdateTermRequestMutation()` - Update existing term
- `useDeleteTermMutation()` - Delete term
- `useSaveSubClauseRequestMutation()` - Create new subclause
- `useUpdateSubClauseMutation()` - Update existing subclause
- `useDeleteSubClauseMutation()` - Delete subclause
- `useUpdateClauseSortMutation()` - Update clause sort order

## Form Validation

All forms use `react-hook-form` with built-in validation:
- Required field validation
- Persian error messages
- Real-time validation feedback

## Styling

Modals follow the project's design system:
- Consistent width (600px for ClauseModal, 700px for others)
- Border and shadow styles matching the theme
- Persian text direction and typography
- Proper spacing and padding
- Responsive layouts

## Notes

- All modals reset their form state when closed
- Loading states prevent multiple submissions
- Modals use the `hideCloseButton` prop and provide custom close icons
- Error messages are displayed via toast notifications
- Success operations trigger automatic data refresh

