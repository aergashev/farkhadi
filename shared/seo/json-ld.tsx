/**
 * Renders one or more JSON-LD objects as a <script type="application/ld+json">.
 * Server component — emitted in the initial HTML so crawlers read it directly.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // schema objects are built from trusted server data, not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
