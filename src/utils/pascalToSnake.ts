export default function pascalToKebab(text: string) {
  return text.replace(/(?<!^)([A-Z])/g, "-$1").toLowerCase();
}
