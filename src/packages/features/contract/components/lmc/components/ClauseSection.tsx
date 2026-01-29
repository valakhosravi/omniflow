"use client";

import {
  Edit2,
  Trash,
  Add,
  More,
  MessageAdd1,
  MessageText1,
  ArrowDown2,
  ArrowUp2,
} from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import { Tooltip } from "@/ui/NextUi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ClauseSectionProps,
  DragHandleProps,
} from "../types/ContractReviewTypes";
import { SortableTermSection, TermSection } from "./TermSection";

// Sortable Clause Section Wrapper
export function SortableClauseSection(props: ClauseSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.clause.ClauseId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ClauseSection {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
}

export function ClauseSection({
  clause,
  clauseIndex,
  subClauseStartIndexLookup,
  showCommentToggle = false,
  getTermCommentToggle = () => false,
  termComments,
  clauseComments,
  activeCommentInputs,
  commentTexts,
  onToggleCommentInput,
  onAddComment,
  onCancelComment,
  setCommentTexts,
  renderCommentThread,
  renderCommentInput,
  onEditClause,
  onEditTerm,
  onEditSubClause,
  onDeleteClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddTerm,
  onAddSubClause,
  hasAccessToEdit = true,
  onTermDragEnd,
  clauseId,
  dragHandleProps,
  isExpanded = true,
  onToggleExpansion,
  showActionsOnHover = true,
}: ClauseSectionProps & {
  dragHandleProps?: DragHandleProps;
}) {
  const clauseKey = `clause-${clause.ClauseId}`;
  const isClauseCommentActive = activeCommentInputs[clauseKey];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="border border-primary-950/[.1] rounded-[16px] overflow-hidden bg-white">
      {/* Clause Header */}
      <div
        className={`p-5 bg-primary-950/[.03] border-primary-950/[.1] group ${
          isExpanded ? "border-b" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 justify-between">
            <div className="inline-flex gap-2">
              {/* Drag Handle */}
              {hasAccessToEdit && dragHandleProps && (
                <button
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  className="cursor-grab active:cursor-grabbing text-primary-950/[.4] hover:text-primary-950/[.7] transition-colors"
                >
                  <More size={20} className="rotate-90" />
                </button>
              )}
              <h3 className="text-[18px] font-bold text-primary-950">
                {clause.ClauseName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {hasAccessToEdit && showCommentToggle && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() =>
                      onToggleCommentInput("clause", clause.ClauseId)
                    }
                    className={`font-semibold !rounded-[12px] text-xs transition-opacity ${
                      showActionsOnHover ? "opacity-0 group-hover:opacity-100" : ""
                    }`}
                  >
                    <MessageAdd1 size={14} />
                    افزودن نظر و ارجاع
                  </CustomButton>
                )}
                {hasAccessToEdit && onEditClause && (
                  <Tooltip
                    placement="top"
                    content="ویرایش ماده"
                    closeDelay={300}
                    className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                    offset={4}
                  >
                    <CustomButton
                      buttonSize="xs"
                      buttonVariant="outline"
                      iconOnly
                      onPress={() => onEditClause(clause)}
                      className={`font-semibold transition-opacity ${
                        showActionsOnHover
                          ? "opacity-0 group-hover:opacity-100"
                          : ""
                      }`}
                    >
                      <Edit2 size={16} />
                    </CustomButton>
                  </Tooltip>
                )}
                {hasAccessToEdit && onDeleteClause && (
                  <Tooltip
                    placement="top"
                    content="حذف ماده"
                    closeDelay={300}
                    className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                    offset={4}
                  >
                    <CustomButton
                      buttonSize="xs"
                      buttonVariant="outline"
                      iconOnly
                      onPress={() => onDeleteClause(clause)}
                      className={`font-semibold !text-danger transition-opacity ${
                        showActionsOnHover
                          ? "opacity-0 group-hover:opacity-100"
                          : ""
                      }`}
                    >
                      <Trash size={16} />
                    </CustomButton>
                  </Tooltip>
                )}
                {hasAccessToEdit && onAddTerm && (
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    onPress={() => onAddTerm(clause)}
                    className={`font-semibold !rounded-[12px] transition-opacity ${
                      showActionsOnHover ? "opacity-0 group-hover:opacity-100" : ""
                    }`}
                  >
                    <Add size={16} />
                    افزودن بند جدید
                  </CustomButton>
                )}
              </div>
            </div>
            {/* Accordion Toggle Button */}
          </div>
          <div className="inline-flex gap-2">
            {clauseComments.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary-950/[.05] rounded-[6px]">
                <MessageText1 size={14} className="text-primary-950/[.6]" />
                <span className="text-[12px] font-medium text-primary-950/[.6]">
                  {clauseComments.length}
                </span>
              </div>
            )}
            {onToggleExpansion && (
              <button
                onClick={onToggleExpansion}
                className="text-primary-950/[.6] hover:text-primary-950 transition-colors p-1 hover:bg-primary-950/[.05] rounded"
                aria-label={isExpanded ? "بستن" : "باز کردن"}
              >
                {isExpanded ? <ArrowUp2 size={20} /> : <ArrowDown2 size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Clause Comment Input */}
        {isExpanded &&
          hasAccessToEdit &&
          isClauseCommentActive &&
          renderCommentInput("clause", clause.ClauseId, clause.ClauseName)}

        {/* Clause Comments Thread */}
        {isExpanded &&
          clauseComments.length > 0 &&
          renderCommentThread(clauseComments, "clause", clause.ClauseId)}
      </div>

      {/* Terms */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {(() => {
            // Sort terms by SortOrder
            const sortedTerms = [...clause.Terms].sort(
              (a, b) => a.SortOrder - b.SortOrder
            );
            const cluaseSortOrder = clauseIndex;

            return onTermDragEnd && clauseId ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onTermDragEnd(clauseId, sortedTerms)}
              >
                <SortableContext
                  items={sortedTerms.map((term) => term.TermId)}
                  strategy={verticalListSortingStrategy}
                >
                  {sortedTerms.map((term, termIndex) => {
                    const subClauseStartIndex =
                      subClauseStartIndexLookup[String(term.TermId)] ?? 0;
                    const termCommentToggle = getTermCommentToggle(
                      Number(term.TermId)
                    );

                    return (
                      <SortableTermSection
                        key={term.TermId}
                        term={term}
                        termIndex={termIndex + 1}
                        cluaseSortOrder={cluaseSortOrder}
                        subClauseStartIndex={subClauseStartIndex}
                        showCommentToggle={termCommentToggle}
                        comments={termComments[Number(term.TermId)] || []}
                        activeCommentInputs={activeCommentInputs}
                        commentTexts={commentTexts}
                        onToggleCommentInput={onToggleCommentInput}
                        onAddComment={onAddComment}
                        onCancelComment={onCancelComment}
                        setCommentTexts={setCommentTexts}
                        renderCommentThread={renderCommentThread}
                        renderCommentInput={renderCommentInput}
                        onEditTerm={onEditTerm}
                        onEditSubClause={onEditSubClause}
                        onDeleteTerm={onDeleteTerm}
                        onDeleteSubClause={onDeleteSubClause}
                        onAddSubClause={onAddSubClause}
                        hasAccessToEdit={hasAccessToEdit}
                        showActionsOnHover={showActionsOnHover}
                      />
                    );
                  })}
                </SortableContext>
              </DndContext>
            ) : (
              sortedTerms.map((term, termIndex) => {
                const subClauseStartIndex =
                  subClauseStartIndexLookup[String(term.TermId)] ?? 0;
                const termCommentToggle = getTermCommentToggle(
                  Number(term.TermId)
                );

                return (
                  <TermSection
                    key={term.TermId}
                    term={term}
                    termIndex={termIndex + 1}
                    cluaseSortOrder={cluaseSortOrder}
                    subClauseStartIndex={subClauseStartIndex}
                    showCommentToggle={termCommentToggle}
                    comments={termComments[Number(term.TermId)] || []}
                    activeCommentInputs={activeCommentInputs}
                    commentTexts={commentTexts}
                    onToggleCommentInput={onToggleCommentInput}
                    onAddComment={onAddComment}
                    onCancelComment={onCancelComment}
                    setCommentTexts={setCommentTexts}
                    renderCommentThread={renderCommentThread}
                    renderCommentInput={renderCommentInput}
                    onEditTerm={onEditTerm}
                    onEditSubClause={onEditSubClause}
                    onDeleteTerm={onDeleteTerm}
                    onDeleteSubClause={onDeleteSubClause}
                    onAddSubClause={onAddSubClause}
                    hasAccessToEdit={hasAccessToEdit}
                    showActionsOnHover={showActionsOnHover}
                  />
                );
              })
            );
          })()}
        </div>
      )}
    </div>
  );
}
