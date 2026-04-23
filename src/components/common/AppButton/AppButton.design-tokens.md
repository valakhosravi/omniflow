# Button Design System Tokens

Reference from design: button color, size, and states.

## Sizes

| Size     | Padding   | Height | Border radius (with text) | Border radius (icon only) | Font size | Line height | Font weight |
|----------|-----------|--------|---------------------------|---------------------------|-----------|-------------|-------------|
| X-Small  | 6px 12px  | 32px   | 8px                       | 8px                       | 14px      | 27px        | 500         |
| Small    | 8px 16px  | 40px   | 12px                      | 8px                       | 14px      | 20px        | 600         |
| Medium   | 12px 24px | 48px   | 16px (12px for Info)      | 12px                      | 14px      | 20px        | 600         |
| Large    | 16px 32px | 56px   | 20px                      | 12px                      | 16px      | 24px        | 600         |

Icon holder: 24×24px for icon-only (20×20px icon inside).

## Semantic Colors (Primary = brand blue)

| Severity | Primary (solid) | Hover    | Pressed  |
|----------|-----------------|----------|----------|
| Primary  | #1C3A63         | #244A80  | #162E50  |
| Success  | #4CAF50         | (darker) | (darker) |
| Warning  | #FFA726         | (darker) | (darker) |
| Danger   | #FF1751         | (darker) | (darker) |
| Info     | #42A5F5         | (darker) | (darker) |

## Outlined & Text

- **Outlined default:** bg #FFFFFF, border `rgba(38, 39, 43, 0.2)` or semantic color, text = semantic color.
- **Outlined hover:** bg #F8F9FA, same border/text.
- **Outlined pressed:** bg #EDEFF3, same border/text.
- **Text:** transparent bg, no border, text = semantic color (same hover/pressed as outlined for bg: default transparent, hover #F8F9FA, pressed #EDEFF3 — or just text color change).

## Disabled (all variants)

- **Primary (solid):** bg #F7F8F8, border 1px #EEEEF0, text/icon #8F94A1.
- **Outlined:** border 1px #EDEDED, text/icon #8F94A1.
- **Text:** no border, text/icon #8F94A1 (or #B7BBC2 for icon stroke).

## Font

- **Yekan Bakh FaNum** (labels/headings)
- **IRANYekanXFaNum** (body/button text)
