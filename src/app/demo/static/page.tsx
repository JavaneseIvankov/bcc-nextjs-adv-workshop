import { DemoShowcase } from "../_components/demo-showcase";
import { getStaticDemoSnapshot } from "../demo-data";

export default async function StaticDemoPage() {
  const snapshot = await getStaticDemoSnapshot();

  return (
    <DemoShowcase
      strategy="Static Server Component"
      title="Build-time or cached output that stays stable"
      summary="This route reads only cached server data. Refresh it a few times and the timestamp plus fingerprint should remain unchanged while the cached output is reused."
      metrics={[
        { label: "Rendered At", value: snapshot.renderedAt },
        { label: "Fingerprint", value: snapshot.renderFingerprint },
        { label: "Render Source", value: "Cached server helper with 'use cache'." },
        { label: "Request APIs", value: "None. No headers(), cookies(), or searchParams." },
      ]}
      notes={[
        "Hard refresh the route a few times and confirm the values stay the same.",
        "This page never touches request-scoped APIs, so Next.js can keep it static.",
        "The UI matches the other demos so only the rendering strategy changes.",
      ]}
    />
  );
}
