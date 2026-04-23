"use client";

import {
  Edit2,
  Trash,
  Add,
  More,
  MessageAdd1,
  MessageText1,
} from "iconsax-reactjs";
import CustomButton from "@/ui/Button";
import { Tooltip } from "@/ui/NextUi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  TermSectionProps,
  DragHandleProps,
} from "../../../contract.types";

// Sortable Term Section Wrapper
export function SortableTermSection(props: TermSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.term.TermId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TermSection {...props} dragHandleProps={{ attributes, listeners }} />
    </div>
  );
}

export function TermSection({
  term,
  termIndex,
  subClauseStartIndex,
  showCommentToggle = false,
  comments,
  activeCommentInputs,
  onToggleCommentInput,
  cluaseSortOrder,
  renderCommentThread,
  renderCommentInput,
  onEditTerm,
  onEditSubClause,
  onDeleteTerm,
  onDeleteSubClause,
  onAddSubClause,
  hasAccessToEdit = true,
  dragHandleProps,
  showActionsOnHover = true,
}: TermSectionProps & {
  dragHandleProps?: DragHandleProps;
}) {
  const termKey = `term-${term.TermId}`;
  const isTermCommentActive = activeCommentInputs[termKey];

  return (
    <div className="relative">
      {/* Left border line for GitLab-style */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary-950/[.1]" />

      <div className="pl-6 border-l-2 border-transparent hover:border-primary-950/[.2] transition-colors">
        {/* Term Content */}
        <div className="bg-primary-950/[.01] rounded-[12px] p-4 border border-primary-950/[.05] group/term">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              {/* Drag Handle */}
              {hasAccessToEdit && dragHandleProps && (
                <button
                  {...dragHandleProps.attributes}
                  {...dragHandleProps.listeners}
                  className="cursor-grab active:cursor-grabbing text-primary-950/[.3] hover:text-primary-950/[.6] transition-colors"
                >
                  <More size={18} className="rotate-90" />
                </button>
              )}
              <h4 className="text-[16px] font-semibold text-primary-950">
                بند {cluaseSortOrder}.{termIndex}
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {hasAccessToEdit && showCommentToggle && (
                <CustomButton
                  buttonSize="xs"
                  buttonVariant="outline"
                  onPress={() =>
                    onToggleCommentInput("term", Number(term.TermId))
                  }
                  className={`font-semibold text-xs !rounded-[12px] transition-opacity ${
                    showActionsOnHover
                      ? "opacity-0 group-hover/term:opacity-100"
                      : ""
                  }`}
                >
                  <MessageAdd1 size={14} />
                  افزودن نظر و ارجاع
                </CustomButton>
              )}
              {hasAccessToEdit && onEditTerm && (
                <Tooltip
                  placement="top"
                  content="ویرایش بند"
                  closeDelay={300}
                  className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                  offset={4}
                >
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    iconOnly
                    onPress={() => onEditTerm(term)}
                    className={`font-semibold transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover/term:opacity-100"
                        : ""
                    }`}
                  >
                    <Edit2 size={14} />
                  </CustomButton>
                </Tooltip>
              )}
              {hasAccessToEdit && onDeleteTerm && (
                <Tooltip
                  placement="top"
                  content="حذف بند"
                  closeDelay={300}
                  className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                  offset={4}
                >
                  <CustomButton
                    buttonSize="xs"
                    buttonVariant="outline"
                    iconOnly
                    onPress={() => onDeleteTerm(term)}
                    className={`font-semibold !text-danger transition-opacity ${
                      showActionsOnHover
                        ? "opacity-0 group-hover/term:opacity-100"
                        : ""
                    }`}
                  >
                    <Trash size={14} />
                  </CustomButton>
                </Tooltip>
              )}
              {hasAccessToEdit && onAddSubClause && (
                <CustomButton
                  buttonSize="xs"
                  buttonVariant="outline"
                  onPress={() => onAddSubClause(term)}
                  className={`font-semibold transition-opacity text-xs !rounded-[12px] ${
                    showActionsOnHover
                      ? "opacity-0 group-hover/term:opacity-100"
                      : ""
                  }`}
                >
                  <Add size={14} />
                  افزودن تبصره
                </CustomButton>
              )}
              {comments.length > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-primary-950/[.05] rounded-[6px]">
                  <MessageText1 size={14} className="text-primary-950/[.6]" />
                  <span className="text-[12px] font-medium text-primary-950/[.6]">
                    {comments.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-[14px] text-primary-950/[.7] leading-relaxed mb-3 whitespace-pre-wrap">
            {term.FinalDescription || term.InitialDescription}
          </div>

          {/* SubClauses */}
          <div className="mt-3 pl-4 border-r-2 border-primary-950/[.1] pr-4">
            {term.SubClauses && term.SubClauses.length > 0 && (
              <div className="space-y-2">
                {term.SubClauses.map((subClause, index) => (
                  <div
                    key={subClause.SubClauseId || index}
                    className="group/subclause"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-[13px] text-primary-950/[.8]">
                        تبصره {subClauseStartIndex + index + 1}
                      </div>
                      <div className="flex items-center gap-1">
                        {hasAccessToEdit && onEditSubClause && (
                          <Tooltip
                            placement="top"
                            content="ویرایش تبصره"
                            closeDelay={300}
                            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px]"
                            offset={4}
                          >
                            <CustomButton
                              buttonSize="xs"
                              buttonVariant="outline"
                              iconOnly
                              onPress={() =>
                                onEditSubClause(subClause, Number(term.TermId))
                              }
                              className="font-semibold opacity-0 group-hover/subclause:opacity-100 transition-opacity"
                            >
                              <Edit2 size={12} />
                            </CustomButton>
                          </Tooltip>
                        )}
                        {hasAccessToEdit && onDeleteSubClause && (
                          <Tooltip
                            placement="top"
                            content="حذف تبصره"
                            closeDelay={300}
                            className="bg-primary-focus text-secondary-0 font-medium text-[12px]/[18px] px-[6px] py-[3.5px] rounded-[4px] "
                            offset={4}
                          >
                            <CustomButton
                              buttonSize="xs"
                              buttonVariant="outline"
                              iconOnly
                              onPress={() =>
                                onDeleteSubClause(
                                  subClause,
                                  Number(term.TermId),
                                )
                              }
                              className="font-semibold !text-danger opacity-0 group-hover/subclause:opacity-100 transition-opacity"
                            >
                              <Trash size={12} />
                            </CustomButton>
                          </Tooltip>
                        )}
                      </div>
                    </div>
                    <div className="text-[13px] text-primary-950/[.6] leading-relaxed">
                      {subClause.Description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Term Comment Input */}
        {hasAccessToEdit &&
          isTermCommentActive &&
          renderCommentInput("term", Number(term.TermId), term.Title)}

        {/* Term Comments Thread */}
        {comments.length > 0 &&
          renderCommentThread(comments, "term", Number(term.TermId))}
      </div>
    </div>
  );
}
