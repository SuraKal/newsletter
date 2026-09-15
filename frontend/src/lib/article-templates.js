export const ARTICLE_TEMPLATES = [
  { key: "feature", label: "Feature" },
  { key: "classic", label: "Classic" },
  { key: "newspaper", label: "Newspaper" },
  { key: "magazine", label: "Magazine" },
  { key: "tabloid", label: "Tabloid" },
  { key: "newsletter", label: "Newsletter" },
];

export const DEFAULT_ARTICLE_TEMPLATE = "feature";

export function isValidArticleTemplate(key) {
  return ARTICLE_TEMPLATES.some((template) => template.key === key);
}

export function getTemplateLabel(key) {
  return (
    ARTICLE_TEMPLATES.find((template) => template.key === key)?.label ||
    DEFAULT_ARTICLE_TEMPLATE.charAt(0).toUpperCase() +
      DEFAULT_ARTICLE_TEMPLATE.slice(1)
  );
}