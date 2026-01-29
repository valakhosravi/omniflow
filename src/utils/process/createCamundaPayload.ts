interface CamundaVariable {
  value: any;
  type: string;
}

interface CamundaPayload {
  variables: Record<string, CamundaVariable>;
}

export function createCamundaPayload(
  data: Record<string, any>
): CamundaPayload {
  const getCamundaType = (value: any): string => {
    if (typeof value === "boolean") return "Boolean";
    if (typeof value === "number") return "Long";
    if (value instanceof Date) return "Date";
    return "String";
  };

  const variables: Record<string, CamundaVariable> = {};

  for (const [key, value] of Object.entries(data)) {
    variables[key] = {
      value,
      type: getCamundaType(value),
    };
  }

  return { variables };
}
