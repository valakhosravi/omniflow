export interface ProcessVariable {
    value: string | number | boolean;
    type: "string" | "integer" | "boolean" | "double" | "long" | "short" | "date" | "object";
  }
  
  export interface CompleteProcessRequest {
    userId: string;
    variables: {
      [key: string]: ProcessVariable;
    };
  }