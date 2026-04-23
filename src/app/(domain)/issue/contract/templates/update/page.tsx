"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/packages/auth/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/ui/Loading";
import NonTypeCompleteContractIndexPageComponent from "@/features/contract/components/page-components/NonTypeCompleteContractIndexPageComponent";
import {
  useSubCategories,
  useGetSubCategoryTemplate,
} from "@/features/contract/hook/contractHook";
import { useDispatch } from "react-redux";
import {
  setContractData,
  setCategoryId,
  setcontractTitle,
} from "@/features/contract/contract.slices";
import {
  GetContractInfo,
  SubCategoryField,
  TemplateVariable,
} from "@/features/contract/contract.types";
import AppBreadcrumb from "@/components/common/AppBreadcrumb/AppBreadcrumb";
import { BreadcrumbsItem } from "@/components/common/AppBreadcrumb/appBreadcrumb.types";

// Convert SubCategoryField[] to TemplateVariable[]
const convertSubCategoryFieldsToVariables = (
  fields: SubCategoryField[],
): TemplateVariable[] => {
  return fields.map((field) => ({
    ContractFieldId: field.ContractFieldId,
    Name: field.Name,
    DisplayName: field.DisplayName,
    FieldType: field.FieldType,
    FieldTypeDescription: field.FieldTypeDescription,
    IsRequired: field.IsRequired,
    SortOrder: field.SortOrder,
    CreatedDate: field.CreatedDate,
    id: field.ContractFieldId
      ? String(field.ContractFieldId)
      : Date.now().toString(),
  }));
};

const breadcrumbs: BreadcrumbsItem[] = [
  { Name: "خانه", Href: "/" },
  { Name: "قالب‌های قرارداد", Href: "/issue/contract/templates" },
  { Name: "ویرایش قالب", Href: "/issue/contract/templates/update" },
];

export default function Template() {
  const { userDetail, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const subCategoryId = Number(searchParams.get("subCategoryId"));
  const categoryId = Number(searchParams.get("categoryId")) || 1;

  // Get subcategories for the category
  const { isLoading: isLoadingSubCategories } = useSubCategories(categoryId);

  // Get the subcategory template
  const { template: subCategoryTemplate, isLoading: isLoadingTemplate } =
    useGetSubCategoryTemplate(subCategoryId || null);

  const [templateLoaded, setTemplateLoaded] = React.useState(false);
  const [initialVariables, setInitialVariables] = React.useState<
    TemplateVariable[]
  >([]);

  useEffect(() => {
    if (!isLoading && userDetail) {
      const groupKeys = userDetail?.UserDetail?.GroupKeys || [];
      const hasLMC = groupKeys.some((key) => key.toUpperCase().includes("LMC"));

      if (!hasLMC) {
        router.replace("/unauthorized");
      }
    }
  }, [userDetail, isLoading, router]);

  // Load template data when available
  useEffect(() => {
    if (subCategoryTemplate && subCategoryId) {
      try {
        let contractData: GetContractInfo;

        if (subCategoryTemplate.Template) {
          const parsed = JSON.parse(subCategoryTemplate.Template);

          // Check if parsed data is a full GetContractInfo object or just ContractClauseDetails[]
          if (
            parsed &&
            typeof parsed === "object" &&
            "ContractClauses" in parsed
          ) {
            // It's a full GetContractInfo object
            contractData = {
              ContractId: parsed.ContractId ?? 0,
              ContractTitle:
                parsed.ContractTitle ?? (subCategoryTemplate.Name || ""),
              IsType:
                parsed.IsType ?? (subCategoryTemplate.IsPersonal || false),
              CategoryId: parsed.CategoryId ?? subCategoryTemplate.CategoryId,
              FilePath: parsed.FilePath ?? "",
              ContractFields: Array.isArray(parsed.ContractFields)
                ? parsed.ContractFields
                : [],
              ContractClauses: Array.isArray(parsed.ContractClauses)
                ? parsed.ContractClauses
                : [],
              Attachments: Array.isArray(parsed.Attachments)
                ? parsed.Attachments
                : [],
            };
          } else if (Array.isArray(parsed)) {
            // It's just an array of ContractClauseDetails
            contractData = {
              ContractId: 0,
              ContractTitle: subCategoryTemplate.Name || "",
              IsType: subCategoryTemplate.IsPersonal || false,
              CategoryId: subCategoryTemplate.CategoryId,
              FilePath: "",
              ContractFields: [],
              ContractClauses: parsed,
              Attachments: [],
            };
          } else {
            // Fallback: empty template
            contractData = {
              ContractId: 0,
              ContractTitle: subCategoryTemplate.Name || "",
              IsType: subCategoryTemplate.IsPersonal || false,
              CategoryId: subCategoryTemplate.CategoryId,
              FilePath: "",
              ContractFields: [],
              ContractClauses: [],
              Attachments: [],
            };
          }
        } else {
          // No template data, create empty contract data
          contractData = {
            ContractId: 0,
            ContractTitle: subCategoryTemplate.Name || "",
            IsType: subCategoryTemplate.IsPersonal || false,
            CategoryId: subCategoryTemplate.CategoryId,
            FilePath: "",
            ContractFields: [],
            ContractClauses: [],
            Attachments: [],
          };
        }

        // Set contract data in Redux
        dispatch(setContractData(contractData));
        dispatch(setCategoryId(contractData.CategoryId));
        dispatch(setcontractTitle(contractData.ContractTitle));

        // Convert SubCategoryFields to TemplateVariable[] if available
        if (
          subCategoryTemplate.SubCategoryFields &&
          subCategoryTemplate.SubCategoryFields.length > 0
        ) {
          const variables = convertSubCategoryFieldsToVariables(
            subCategoryTemplate.SubCategoryFields,
          );
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setInitialVariables(variables);
          console.log("✅ Loaded SubCategoryFields as variables:", variables);
        }

        setTemplateLoaded(true);
        console.log("✅ Template loaded successfully:", contractData);
      } catch (error) {
        console.error("Error parsing subcategory template:", error);
        // Set default empty contract data on error
        const contractData: GetContractInfo = {
          ContractId: 0,
          ContractTitle: subCategoryTemplate?.Name || "",
          IsType: subCategoryTemplate?.IsPersonal || false,
          CategoryId: subCategoryTemplate?.CategoryId || categoryId,
          FilePath: "",
          ContractFields: [],
          ContractClauses: [],
          Attachments: [],
        };
        dispatch(setContractData(contractData));
        setTemplateLoaded(true); // Set to true even on error to prevent infinite loading
      }
    } else if (!subCategoryId) {
      // If no subCategoryId, we can still render (for create mode)
      setTemplateLoaded(true);
    } else if (!isLoadingTemplate && !subCategoryTemplate) {
      // If template loading is complete but no template found
      setTemplateLoaded(true);
    }
  }, [
    subCategoryTemplate,
    subCategoryId,
    dispatch,
    isLoadingTemplate,
    categoryId,
  ]);

  if (
    isLoading ||
    isLoadingSubCategories ||
    isLoadingTemplate ||
    (subCategoryId && !templateLoaded)
  ) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  // Check access before rendering
  const groupKeys = userDetail?.UserDetail?.GroupKeys || [];
  const hasLMC = groupKeys.some((key) => key.toUpperCase().includes("LMC"));

  if (!hasLMC) {
    return null; // Will redirect in useEffect
  }

  const templateMeta = subCategoryTemplate
    ? {
        CategoryId: subCategoryTemplate.CategoryId,
        Name: subCategoryTemplate.Name || "",
        Description: subCategoryTemplate.Description || "",
      }
    : null;

  return (
    <NonTypeCompleteContractIndexPageComponent
      showStepper={false}
      showSubmitAndExport={false}
      isTemplatePage={true}
      isUpdateMode={true}
      templateMeta={templateMeta}
      initialVariables={initialVariables}
      breadcrumbs={<AppBreadcrumb items={breadcrumbs} />}
    />
  );
}
