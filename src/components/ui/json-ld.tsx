/**
 * Renders a JSON-LD block.
 *
 * The payload is serialised and `<` is escaped so a stray closing tag in
 * CMS-authored content cannot break out of the script element.
 */
export function JsonLd({
  id,
  data,
}: {
  id: string;
  data: Record<string, unknown> | null;
}) {
  if (!data) return null;

  const json = JSON.stringify(data, (_key, value) =>
    value === undefined ? undefined : value,
  ).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
