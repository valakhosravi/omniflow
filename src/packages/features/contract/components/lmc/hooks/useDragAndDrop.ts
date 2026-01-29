import {
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { ContractClauseDetails, TermDetails } from "../../../types/contractModel";

interface UseDragAndDropProps {
  onClauseSortChange?: (clauses: ContractClauseDetails[]) => void;
  onTermSortChange?: (clauseId: number, terms: TermDetails[]) => void;
}

export function useDragAndDrop({
  onClauseSortChange,
  onTermSortChange,
}: UseDragAndDropProps) {
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle clause drag end
  const handleClauseDragEnd =
    (sortedClauses: ContractClauseDetails[]) => (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedClauses.findIndex(
          (clause) => clause.ClauseId === active.id
        );
        const newIndex = sortedClauses.findIndex(
          (clause) => clause.ClauseId === over.id
        );

        const reorderedClauses = arrayMove(sortedClauses, oldIndex, newIndex);

        // Update sort order
        const updatedClauses = reorderedClauses.map((clause, index) => ({
          ...clause,
          SortOrder: index + 1,
        }));

        // Call the sort change handler
        if (onClauseSortChange) {
          onClauseSortChange(updatedClauses);
        }
      }
    };

  // Handle term drag end
  const handleTermDragEnd =
    (clauseId: number, sortedTerms: TermDetails[]) => (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = sortedTerms.findIndex(
          (term) => term.TermId === active.id
        );
        const newIndex = sortedTerms.findIndex(
          (term) => term.TermId === over.id
        );

        const reorderedTerms = arrayMove(sortedTerms, oldIndex, newIndex);

        // Update sort order
        const updatedTerms = reorderedTerms.map((term, index) => ({
          ...term,
          SortOrder: index + 1,
        }));

        // Call the term sort change handler
        if (onTermSortChange) {
          onTermSortChange(clauseId, updatedTerms);
        }
      }
    };

  return {
    sensors,
    handleClauseDragEnd,
    handleTermDragEnd,
  };
}

