/**
 * Utility functions for contract PDF rendering
 */

// Convert ASCII digits 0–9 to Persian ۰–۹ inside strings
export const toFaDigits = (str: string | null | undefined): string => {
  if (str == null) return "";
  return String(str).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
};

// Remove inline font-family styles (especially IRANYekanX) from HTML content
export const removeInlineFontFamily = (html: string | null | undefined): string => {
  if (!html || typeof html !== 'string') return html as string;
  
  // Remove font-family: IRANYekanX, sans-serif; (with or without quotes, case insensitive)
  let cleaned = html.replace(/font-family\s*:\s*['"]?IRANYekanX['"]?\s*,?\s*sans-serif\s*;?/gi, '');
  
  // Also remove any standalone font-family declarations that might remain
  cleaned = cleaned.replace(/font-family\s*:\s*['"]?IRANYekanX['"]?\s*;?/gi, '');
  
  // Clean up empty style attributes or style attributes with only semicolons/spaces
  cleaned = cleaned.replace(/\s*style\s*=\s*["']\s*;?\s*["']/gi, '');
  cleaned = cleaned.replace(/\s*style\s*=\s*["']\s*["']/gi, '');
  
  // Clean up style attributes that end with semicolon-space or semicolon only
  cleaned = cleaned.replace(/style\s*=\s*["']([^"']*?);\s*["']/gi, (match, content) => {
    const trimmed = content.trim();
    return trimmed ? `style="${trimmed}"` : '';
  });
  
  return cleaned;
};

// Deep-map the content fields that hold visible text
export const mapContentFa = (clauses: any[]): any[] => {
  return (clauses || []).map(c => ({
    ...c,
    ClauseName: toFaDigits(c.ClauseName),
    ClauseDescription: c.ClauseDescription ? removeInlineFontFamily(c.ClauseDescription) : c.ClauseDescription,
    Terms: (c.Terms || []).map((t: any) => ({
      ...t,
      Title: toFaDigits(t.Title),
      InitialDescription: removeInlineFontFamily(toFaDigits(t.InitialDescription)),
      FinalDescription: removeInlineFontFamily(toFaDigits(t.FinalDescription)),
      SubClauses: (t.SubClauses || []).map((sc: any) => ({
        ...sc,
        Title: toFaDigits(sc.Title),
        Description: removeInlineFontFamily(toFaDigits(sc.Description)),
      })),
    })),
  }));
};

