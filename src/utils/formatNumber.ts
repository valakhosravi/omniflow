export function formatNumberWithCommas(value: string | number): string {
  // Convert to string and remove existing commas
  const cleanValue = typeof value === "string" 
    ? value.replace(/,/g, "") 
    : value.toString();
  
  // Check if it's a valid number (only digits)
  if (!/^\d+$/.test(cleanValue)) return "";
  
  // For large numbers, format manually to avoid precision loss
  if (cleanValue.length > 15) {
    // Add commas every 3 digits from the right
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // For smaller numbers, use the original method
  const num = parseInt(cleanValue);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US");
}

export function removeCommas(value: string): string {
  return value.replace(/,/g, "");
}

export function formatNumberShort(num?: number): string {
  if (!num) return "0";
  if (num >= 1_000_000)
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return num.toString();
}